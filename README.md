# geckoboard-push

[![Build Status](https://travis-ci.org/tocco/geckoboard-push.svg?branch=master)](https://travis-ci.org/tocco/geckoboard-push)

This project consists of a Node.js script to update a
Geckoboard KPI dashboard.

## Required environment variables

* GECKOBOARD_API_KEY
* BACKOFFICE_USERNAME
* BACKOFFICE_PASSWORD

## Datasets

### Available datasets

#### support_tickets.by_version

Fields:

| ID   | Name | Type | Description |
| ---| --- | --- | --- |
| date | Date | date | The date of the snapshot |
| version | Version | string | The Nice2 version |
| tickets | Number of support tickets | number | The total number of the support tickets created for this version on that particular date |
| tickets_per_installation | Number of support tickets per installation | number | The total number of the support tickets created for this version on that particular date divided by the number of installations running on that particular version |

#### installations.by_version

Fields:

| ID   | Name | Type | Description |
| ---| --- | --- | --- |
| date | Date | date | The date of the snapshot |
| version | Version | string | The Nice2 version |
| installations | Number of installations | number | The total number of installations running on that particular version on that particular date |

### Add more datasets

To add another dataset, add the script in the folder `src/datasets` and
export it via the `src/datasets/index.js` file.

The dataset script should export the following properties:
* `id` (e.g. 'support_tickets.by_version')
* `feed` (Optional; Array of dataset ids to pass the data from into the toDatasetRecords function (2nd argument))
* `scheme` (The geckoboard dataset scheme)
* `deleteBy` (The oldest records (by insertion time) get deleted, once a limit of 5000 is reached.
  This behaviour can be overridden by using this property)
* `query` (Object containing the following properties to query the Backoffice:
  `entity`, `paths`, `where`, `resolve`, `fields`)
* `toDatasetRecords` (Function to convert the Backoffice query result into records matching the Geckoboard scheme
  (1st argument: query result, 2nd argument: required data from other datasets (see `feed)))
