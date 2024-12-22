# SwiftCloud Backend API

This document provides instructions for setting up, running, and testing the SwiftCloud Backend API on your local machine. The API is developed using NestJS, TypeORM, PostgreSQL, and GraphQL.

## Live Demo URL

You can access the live demo of the SwiftCloud Backend API at the following URL: 

https://swiftcloud-fvze.onrender.com/graphql


## Prerequisites

Ensure the following tools are installed on your system:

- Node.js (v16 or above)
- npm (Node Package Manager)
- Docker
- Docker Compose

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd SwiftCloud
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL Using Docker**
   Run the following command to start a PostgreSQL container:
   ```bash
   docker run -d \
     --name postgres \
     -e POSTGRES_USER=myuser \
     -e POSTGRES_PASSWORD=mypassword \
     -e POSTGRES_DB=mydatabase \
     -v pgdata:/var/lib/postgresql/data \
     -p 5432:5432 \
     postgres
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the project root with the following contents:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=myuser
   DATABASE_PASSWORD=mypassword
   DATABASE_NAME=mydatabase
   ```

5. **Run Database Migrations**
   Use the following command to generate and run migrations:
   ```bash
   npm run migration:run
   ```

6. **Seed the Database**
   To populate the database with initial data from the provided CSV file:
   - Run the seed script:
     ```bash
     npm run seed
     ```

## Running the Application

To start the application in development mode:
```bash
npm run start:dev
```

The GraphQL Playground will be available at:
```
http://localhost:3000/graphql
```

## Example GraphQL Queries

### Get Songs by Year
```graphql
query GetSongsByYear {
  songsByYear(year: 2020) {
    id
    title
    artists {
      name
    }
    album {
      title
    }
  }
}
```

### Get Popular Albums
```graphql
query GetPopularAlbums {
  popularAlbums {
    id
    title
    songs {
      title
      monthlyPlays {
        month
        playCount
      }
    }
  }
}
```

### Search Songs
```graphql
query GetSongs {
  searchSongs(input: {
    query: "love"
    pagination: { limit: 10, offset: 0 }
  }) {
    title
    artists {
      name
    }
  }
}
```

### Get Popular Songs
```graphql
query GetPopularSongs {
  popularSongs(
    filter: { month: "July" }
    pagination: { limit: 5 }
  ) {
    title
    monthlyPlays {
      playCount
    }
  }
}
```

## Testing

Run unit tests using the following command:
```bash
npm run test
```

## Notes for the Reviewer

- The API supports GraphQL for flexible and dynamic querying.
- The database is populated using data from the provided CSV file.
- To enhance performance and scalability, TypeORM is used with PostgreSQL as the database.
- The provided queries demonstrate key functionalities of the API.

### Future Enhancements

If this were a production system, the following improvements would be prioritized:

1. **Advanced Caching**: Currently I use in memory caching, Integrate caching mechanisms (e.g., Redis) can improve response times for frequently queried data and allow for multiple instances of the API to share cached data.
2. **Authentication and Authorization**: Secure the API endpoints with user authentication.
3. **Error Handling and Validation**: Improve error handling to cover edge cases and add input validations.
4. **Rate Limiting**: Implement rate limiting to prevent abuse and ensure fair usage of the API.
5. **Monitoring and Logging**: Set up monitoring and logging tools to gain insights into the system's performance and troubleshoot issues effectively. Tools like Prometheus, Grafana, and ELK stack can be used for this purpose.
6. **CI/CD Pipeline**: Implement a CI/CD pipeline to automate the deployment process and ensure a smooth and reliable release cycle.
7. **Load Balancing**: Set up load balancing to distribute traffic evenly across multiple instances of the API and improve scalability and availability.
8. **Database Partitioning**: As the data grows, consider partitioning the database to improve query performance and manageability. This can be done based on criteria such as date.


Thank you for reviewing my submission! If you encounter any issues or have further questions, feel free to reach out.

