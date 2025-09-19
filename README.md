# hasha
Learning some new tools/technologies within the context of a simple CRUD app.

![Screenshot](https://github.com/icomey8/hasha/blob/main/hasha.png)

Play around with it here: https://hasha-theta.vercel.app/

## AWS

#### CDK
Managed my Cognito and Lambda configurations as separate stacks. 

#### Cognito & Lambda
I learned a lot more about a standard authentication flow and JWTs.  Setting up a post-sign up lambda trigger and getting it to work with Supabase was an interesting challenge.

## Docker
I think I finally gained a decent understanding of Docker's benefits.  Wrapped my frontend and backend into separate containers, used Compose to manage them as I developed the app.  It helped a ton and I was able to optimize the sizes of the images as well.

## FastAPI, Logging, and Testing
I heard a lot about FastAPI and wanted to give it a shot, and ended up being a great choice.  Managing routes and dependencies was straightforward. Also used Loguru to write logs for the backend to a single file, and Pytest for unit tests for endpoints and interactions with my database.

## Github Actions
Made a basic workflow to automatically deploy the backend to Render.
