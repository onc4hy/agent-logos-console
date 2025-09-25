# Common Module

This module provides common utility functions for the application.

## Features

### Fetch JSON from URL
Endpoint to fetch JSON data from a remote URL.

- **URL**: `/common/fetch-json`
- **Method**: `GET`
- **Query Parameters**:
  - `url` (required): The remote URL to fetch JSON data from

- **Success Response**:
  - **Code**: 200
  - **Content**: The JSON data fetched from the provided URL

- **Error Responses**:
  - **Code**: 400 BAD REQUEST
    - When URL parameter is missing
    - When URL is invalid
    - When the remote URL does not return JSON data
  - **Code**: 408 REQUEST TIMEOUT
    - When the request to the remote URL times out (after 10 seconds)
  - **Code**: 502 BAD GATEWAY
    - When unable to connect to the provided URL
  - **Code**: 500 INTERNAL SERVER ERROR
    - When any other error occurs during the request

## Usage Examples

```bash
# Fetch JSON data from a remote URL
curl "http://localhost:3000/common/fetch-json?url=https://jsonplaceholder.typicode.com/posts/1"
```