# social-network

# API

## **/user/:id/groups GET POST**

- GET: get all groups(id) of user

return:

```
[]int
```

- POST: create new group

not implemented

## **user/:id/chats/ GET POST**

- GET: get list id of user chats ???

return:

```
[]int
```

- POST: create new chat

not implemented

## **post/:id/comments/ GET POST**

- GET: get list of comments id

return:

```
[]int
```

- POST: create new comment

not implemented

## **/groups/ GET POST**

- GET: get list of groups(id)

return:

```
[]int
```

- POST: create new group

not implemented

## **/group/:id GET PUT DELETE**

- GET: get group info

return:

```
Id          int
Title       string
Description string
Members     []int
Requsts     []int
```

- PUT: update group info

not implemented

- DELETE: delete group

not implemented

## **chat/:id/ GET POST**

- GET: get all messages from chat

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

- POST: create new message

not implemented

## **comment/:id GET**

- GET: get detailed comment info

return:

```
ParentId       int
UserId         int
Login          string
Text           string
DateOfCreation int
```
