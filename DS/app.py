# Import the libraries
import pandas as pd
import re
from geopy.distance import geodesic
import plotly.graph_objects as go
import streamlit as st

# Load and Clean Data

df =  pd.read_excel("Tourist destinations.xls") #Load the data to a variable named df
#Filter the dataframe
df.columns = [re.sub(r'(?<!^)(?=[A-Z])', '_', col).replace(" ", "_").lower() for col in df.columns] # Convert column names to snakecase
df.drop(columns=["unnamed:_0", "zipcode"], inplace=True, errors='ignore') # Drop unnecessary columns, For zipcode most  of the values are missing
df.dropna(subset=['latitude', 'longitude'], inplace=True) #Drop the rows having missing latitude and longitudes
df= df.drop_duplicates(subset='address') # Drop duplicate address rows implies check for duplicated destinations
# Title and description
st.header('Route Optimizer')
st.write("""
         #### Once you choose a state and how many places you’d like to visit, the app will find the most popular destinations in that area. You'll then pick a starting point from that list. Based on your choices, the app will calculate the best travel route, including the total distance, estimated travel time, and the order in which to visit each stop.
         #""")

states = df['state'].unique()
categories = sorted(df['category'].dropna().unique()) if 'category' in df.columns else []

# Sidebar Filters

st.sidebar.title("Tour Planner Filters")

selected_state = st.sidebar.selectbox("Choose a State", sorted(states))

if categories:
    selected_categories = st.sidebar.multiselect("Select Categories", categories, default=categories)
else:
    selected_categories = None

max_locations = st.sidebar.slider("How many destinations would you like to visit?", min_value=2, max_value=10, value=9)
num_stops = st.sidebar.slider("Number of Route Stops", min_value=2, max_value=max_locations, value=6)


# Filter Data Based on Selections
# Choose the state
filtered_df = df[df['state'] == selected_state]

if selected_categories:
    filtered_df = filtered_df[filtered_df['category'].isin(selected_categories)]

# This block of code filters and ranks destinations based on their popularity score, then selects the top N destinations requested by the user. It returns a neatly indexed DataFrame called top_n_destinations for further use.
top_n_destinations = (
    filtered_df
    .sort_values('weighted__score', ascending=False)    
    .head(max_locations)
    .reset_index(drop=True)
)
#This block ensures the app handles cases where the user requests more stops than available destinations
if len(top_n_destinations) < num_stops:
    st.warning("Not enough locations available for the number of stops selected.")
    st.stop()
#Pick the top N destinations from the list of highest-rated places and store them for route planning. If num_stops = 5, and top_n_destinations has 9 rows, this line returns rows 0, 1, 2, 3 and 4 the top 3 destinations.
selected_stops = top_n_destinations.iloc[:num_stops]
# Select the starting destination
start_point_name = st.sidebar.selectbox("Choose your starting point", top_n_destinations['name'])

## Build Route Starting From User Selection

## Defines a function named build_route that takes three inputs:(df: a DataFrame containing destination data, start_name :the name of the starting location chosen by the user, num_stops: the total number of stops the user wants on their route)
def build_route(df, start_name, num_stops):
    start = df[df['name'] == start_name].iloc[0] #Finds the row in df where the 'name' column matches the start_name. .iloc[0] retrieves the first matching row as a Series object, representing the starting point of the route
    remaining_df = df[df['name'] != start_name].copy() # Creates a new DataFrame remaining_df containing all destinations except the starting point, .copy is used to avoid modifying the original dataframe when changes are made later

    # Sort remaining by score and take top N-1 to fill rest of route
    selected = remaining_df.sort_values(by='weighted__score', ascending=False).head(num_stops - 1) #Selects the top num_stops - 1 rows to fill the rest of the route after the starting point.
    selected = pd.concat([pd.DataFrame([start]), selected]).reset_index(drop=True) #Combines the starting point with the selected top destinations and reset index starting from 0 
    return selected #Returns the final DataFrame containing the ordered list of stops for the route.

#Calls the build_route function
selected_stops = build_route(top_n_destinations.head(max_locations), start_point_name, num_stops)


#  Optimize Route with Nearest Neighbor (from chosen start)

def nearest_neighbor_route(df, start_name): #Defines a function named nearest_neighbor_route
    visited = [] #Initializes an empty list visited to keep track of the ordered route as locations are visited.
    unvisited = df.copy() #Creates a copy of the full dataframe called unvisited to track destinations not yet visited without modifying the original data.
    current_location = unvisited[unvisited['name'] == start_name].iloc[0] #Finds the row in unvisited where the 'name' equals start_name and .iloc[0] selects the first matching row as the current starting location
    visited.append(current_location) #Adds the starting point to the visited list.
    unvisited = unvisited[unvisited['name'] != start_name] #Removes the starting location from unvisited, since it is now visited.

    while not unvisited.empty:  #Starts a loop that runs until there are no more unvisited locations left
        current_coords = (current_location['latitude'], current_location['longitude']) #Stores the latitude and longitude of the current location as a tuple current_coords to calculate distances.
        #Calculates the geographic distance in kilometers from the current location to each unvisited location using the geodesic function
        distances = unvisited.apply(lambda row: geodesic(current_coords, (row['latitude'], row['longitude'])).km, axis=1)
        #Finds the index of the unvisited location with the smallest distance to the current location means the nearest neighbor
        nearest_location= distances.idxmin()
        #Updates current_location to this nearest unvisited destination
        current_location = unvisited.loc[nearest_location]
        #Adds the new current location to the visited list.
        visited.append(current_location)
        #Removes this newly visited location from unvisited
        unvisited = unvisited.drop(nearest_location)

    return pd.DataFrame(visited) #After visiting all locations, converts the visited list of rows back into a dataframe

optimized_route = nearest_neighbor_route(selected_stops, start_point_name) #Calls the nearest_neighbor_route function to calculate an optimized travel route


# Total Distance and Time Calculation
# Defines a function named calculate_total_distance_and_time and assume that average speed in highways is 80kmh
def calculate_total_distance_and_time(route_df, avg_speed_kmh=80):
    total_distance = 0 
    total_time = 0 #Initializes two variables to keep track of the total distance and total time 
    for i in range(len(route_df) - 1): #Starts a loop to iterate through each pair of consecutive stops in the route
        start = (route_df.iloc[i]['latitude'], route_df.iloc[i]['longitude']) # Extracts the latitude and longitude coordinates of current stop
        end = (route_df.iloc[i + 1]['latitude'], route_df.iloc[i + 1]['longitude']) # Extracts the latitude and longitude coordinates of next stop
        dist = geodesic(start, end).km #Calculates the geographic distance between the two stops using the geodesic function.
        total_distance += dist #Add the distance
        total_time += dist / avg_speed_kmh #Add the time
    return total_distance, total_time #Returns the total distance and total estimated travel time for the full route

total_km, total_hr = calculate_total_distance_and_time(optimized_route) #Call the function to calculate total distance and time

# Plot the optimized route

def plot_route(df, title):
    fig = go.Figure()
    fig.add_trace(go.Scattermapbox(
        mode="markers+lines+text",
        lon=df['longitude'],
        lat=df['latitude'],
        text=df['name'],
        marker=dict(size=10, color='blue'),
        line=dict(width=3, color='red'),
        name="Route"
    ))
    fig.update_layout(
        mapbox=dict(
            style="open-street-map",
            center=dict(
                lon=df['longitude'].mean(),
                lat=df['latitude'].mean()
            ),
            zoom=6
        ),
        title=title,
        margin=dict(l=0, r=0, b=0, t=30),
        height=600
    )
    return fig


#  Display the Output

st.markdown("### Optimized Route Map")
st.plotly_chart(plot_route(optimized_route, f"Optimized Route in {selected_state}"), use_container_width=True)

st.markdown(f"**Total Distance:** {total_km:.2f} km")
st.markdown(f"**Estimated Driving Time:** {total_hr:.2f} hours")

st.markdown("### Route Details")
st.dataframe(optimized_route[['name', 'city','address', 'categories', 'rating']].reset_index(drop=True))
