# social-network

# API

## **/login POST**

-   POST: request to login

parametrs:

```
email/login: string
login:       string
password:    string
```

## **/register POST**

-   POST: request to register

parametrs:

```
email       string
login       string
password    string
firstName   string
lastName    string
aboutMe     string
dateOfBirth int
```

return:

```
data:{
    id          int
    email       string
    login       string
    firstName   string
    lastName    string
    dateOfBirth int
    }
errors: [{
    code        uint
    description string}]
```

errors:

```
ErrEmailFormat     = 1
ErrPasswordLow     = 2
ErrPasswordBig     = 3
ErrPasswordFormat  = 4
ErrLoginLow        = 5
ErrLoginHigh       = 6
ErrLoginFormat     = 7
ErrFirstNameFormat = 8
ErrLastNameFormat  = 9
ErrUniqueEmail     = 10
ErrUniqueLogin     = 11
```

## **/logout POST**

-   POST: request to logout

to logout you don't need any information

## **/user/:id GET PUT DELETE**

-   GET: request to get user profile info

return:

```
email       string
login       string
firstName   string
lastName    string
aboutMe     string
dateOfBirth int
```

-   PUT: request to update user profile

not implemented

-   DELETE: request to delete profile

not implemented

## **/user/:id/posts GET POST**

-   GET: get all posts(id) of user including group posts

return:

```
[]int
```

-   POST: create new post

not implemented

## **/user/:id/groups GET POST**

-   GET: get all groups(id) of user

return:

```
[]int
```

-   POST: create new group

not implemented

## **/user/:id/followers GET PUT DELETE**

-   GET: get list of user(id) who followed current user(variable id

return:

```
[]int
```

-   PUT: update list of followers(add)

not implemented

-   DELETE: delete user from list of followers

not implemented

## **user/:id/chats/ GET POST**

-   GET: get list id of user chats ???

return:

```
[]int
```

-   POST: create new chat

not implemented

## **/post/:id GET PUT DELETE**

-   GET: get post info

return:

```
parentId       int
login          string
userId         int
postId         int
title          string
text           string
dateOfCreation int
visibility     string
```

-   PUT: update post info

not implemented

-   DELETE: delete post

not implemented

## **post/:id/comments/ GET POST**

-   GET: get list of comments id

return:

```
[]int
```

-   POST: create new comment

not implemented

## **/groups/ GET POST**

-   GET: get list of groups(id)

return:

```
[]int
```

-   POST: create new group

not implemented

## **/group/:id GET PUT DELETE**

-   GET: get group info

return:

```
Id          int
Title       string
Description string
Members     []int
Requsts     []int
```

-   PUT: update group info

not implemented

-   DELETE: delete group

not implemented

## **chat/:id/ GET POST**

-   GET: get all messages from chat

return:

```
ChatId       int
Messages     []Message{
    MessageId int
    UserId    int
    Login     string
    FirstName string
    LastName  string
    Text      string
}
FirstUserId  int
SecondUserId int
```

-   POST: create new message

not implemented

## **comment/:id GET**

-   GET: get detailed comment info

return:

```
ParentId       int
UserId         int
Login          string
Text           string
DateOfCreation int
```

## **errors**

```
    Registration

    1 --> incorret email format
    2 --> password too short (<8)
    3 --> password too long (>32)
    4 --> use of restricted characters
    5 --> login too short (<4)
    6 --> login too long (>24)
    7 --> use of restricted characters
    8 --> use of restricted characters
    9 --> use of restricted characters
    10 --> email already exists
    11 --> login already exists
```

```
    Logging in

    12 --> wrong username or password
```
