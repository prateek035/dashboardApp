#
# Reading a excel file
#
import time
from datetime import datetime
import xlrd
import json
import requests
import asyncio
import sys

print("\n\n\n\n\n*************************Script Started***********\
		********************************\n\n\n\n\n")

# Previously using static location
# loc = ("./latestData.xlsx")

# Opening an excel file 

wb = xlrd.open_workbook(sys.argv[1])
sheet = wb.sheet_by_index(0)

TotalRows = sheet.nrows
TotalCols = sheet.ncols

print("No. of columns :: " , TotalCols)
print("No. of Rows :: " , TotalRows)

tokens = []

url = "https://secure-cove-75771.herokuapp.com/api/item/"

headers = {
	'content-type': 'application/json'
}

def request_maker(post_data):
	stuff_got = []

	print(post_data)
	
	response = requests.post(url, headers=headers,data = post_data)
	stuff_got.append(response.json())

	return stuff_got


for rowIndex in range(TotalRows+1):
	rowData = sheet.row_values(rowIndex) 
	user = rowData[0]
	if (user == ""):
		print("\n\n\n*******************************************************************************")
		print("Dispatching packet on : ", datetime.now().strftime("%H:%M:%S"))
		print("*******************************************************************************\n\n\n")

		loop = asyncio.get_event_loop()

		for token in tokens:
			token = json.dumps(token)
			loop.run_in_executor(None, request_maker, token)

		tokens = []

		# Timer will stop for 60 seconds
		time.sleep(60)

		continue
	
	userData = rowData[1:]

	# Building a json packet
	
	packet = {
		"userID" : user,
		"values" : userData
	}
	tokens.append(packet)
	packet = json.dumps(packet)

## Now we have data stored in tokens array

print("\n\n*****************Script Ends Here*****************************\n\n")


	