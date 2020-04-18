### IMPORTS
import csv
import urllib.request as urllib
import json
import time

### VARIABLES
url_page = "https://api.theopenvent.com/exampledata/v2/data"
timedelay = 1

### FUNCTIONS
def append_list_as_row(file_name, list_of_elem):
    # Open file in append mode
    with open(file_name, 'a+', newline='') as write_obj:
        csv_writer = csv.writer(write_obj)      # Create a writer object from csv module
        csv_writer.writerow(list_of_elem)   # Add contents of list as last row in the csv file

def check_and_add_data():
    print("checking new data ... ")
    with urllib.urlopen(url_page) as url:
        data = json.loads(url.read())
        print(" -> " + str(len(data.keys())) + " datapoints found")

    print(" -> parsing and adding data to csv... ")
    # check the data    
    for key in data.keys():
        ### read the data
        data_row = data[key]
        data_deviceId = data[key]['device_id']
        data_processed_ = data[key]['processed']
        data_processed_ExpiredCO2 = data[key]['processed']['ExpiredCO2']
        data_processed_ExpiredO2 = data[key]['processed']['ExpiredO2']
        data_processed_MVe = data[key]['processed']['MVe']
        data_processed_flowrate = data[key]['processed']['flowrate']
        data_processed_frequency = data[key]['processed']['frequency']
        data_processed_pressure = data[key]['processed']['pressure']
        data_processed_triggerSettings_ = data[key]['processed']['triggerSettings']
        data_processed_ventilationMode = data[key]['processed']['ventilationMode']
        data_processed_volumePerMinute = data[key]['processed']['volumePerMinute']
        data_processed_volumePerMovement = data[key]['processed']['volumePerMovement']
        data_raw_ = data[key]['raw']
        data_raw_current = data[key]['raw']['current']
        data_raw_pressure1 = data[key]['raw']['pressure1']
        data_raw_pressure2 = data[key]['raw']['pressure2']
        data_raw_temperature1 = data[key]['raw']['temperature1']
        data_raw_temperature2 = data[key]['raw']['temperature2']
        data_time = data[key]['time']
        
        ### check if the file already exists
        filename = str(data_deviceId) + '.csv'
        latest_time = -1
        try:
            row_index = 0
            with open(filename) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                for row in csv_reader:
                    if row:  # avoid blank lines
                        row_index += 1
                        last_row = row
                
                if row_index == 0:
                    print("File empty -> add header")
                    with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
                        writer = csv.writer(csv_file, delimiter=',')
                        writer.writerow(['deviceId','time','ExpiredCO2','ExpiredO2','MVe',
                                         'flowrate','frequency','pressure','ventilationMode','volumePerMinute','volumePerMovement',
                                         'current','pressure1','pressure2','temperature1','temperature2'])
                else:
                    latest_time = last_row[1]
                    
                # Do something with the file
        except IOError:
            print("File not accessible -> new file created")
            with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file, delimiter=',')
                writer.writerow(['deviceId','time','ExpiredCO2','ExpiredO2','MVe',
                                 'flowrate','frequency','pressure','ventilationMode','volumePerMinute','volumePerMovement',
                                 'current','pressure1','pressure2','temperature1','temperature2'])
        
        # Only add data if new data arrives
        if (int(data_time)!=int(latest_time)):
            #print(filename + ' -> add new data')
                
            # List of strings
            row_contents = [data_deviceId,data_time,data_processed_ExpiredCO2,data_processed_ExpiredO2,data_processed_MVe,
                                 data_processed_flowrate,data_processed_frequency,data_processed_pressure,data_processed_ventilationMode,
                                 data_processed_volumePerMinute,data_processed_volumePerMovement,
                                 data_raw_current,data_raw_pressure1,data_raw_pressure2,data_raw_temperature1,data_raw_temperature2]
            
            # Append a list as new line to an old csv file
            append_list_as_row(filename, row_contents)
        else:
            #print(filename + ' -> data ignored')
            pass

### LOOP
try:
    while True:
        check_and_add_data()
        time.sleep(timedelay)
except KeyboardInterrupt:
    print('Manual break by user')
except:
    print('Other thing went wrong ... stopping!')
