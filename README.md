# NoMedia

A social media platform focused on text-based content sharing and topical discussions.

## Overview

NoMedia is a full-stack application that provides a unique social media experience centered around text posts, topic-based organization, and user interactions. The platform supports various content formats including original posts, reposts, quotes, and comments.

## Features

- **User Management**
  - User registration and authentication
  - Profile customization with bio and display name
  - Follow/unfollow functionality

- **Content System**
  - Text-based posts with titles
  - Multiple post formats:
    - Original posts
    - Reposts
    - Quotes
    - Comments
  - Topic-based organization
  - Keyword tagging

- **Interaction Features**
  - Likes
  - Comments
  - Reposts and quotes
  - View tracking
  - User feedback system

- **Content Discovery**
  - Topic-based browsing
  - Personalized recommendations
  - Keyword-based searching
  - User preference tracking

## Tech Stack

### Backend
- Java/Spring Boot
- MySQL Database
- Docker containerization

### Frontend
- React Native
- Expo framework

## Database Schema

The application uses a MySQL database with the following key entities:

- `User` - User accounts and profiles
- `Post` - Content posts with various formats
- `Topic` - Content categorization
- `Keyword` - Content tagging
- `Like` - Post interactions
- `UserPostInteraction` - Tracking user engagement
- `Recommendation` - Personalized content suggestions
