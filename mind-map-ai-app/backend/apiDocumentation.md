# 🔐 1. AUTH ROUTES

### POST /api/auth/register

➡️ Register a new user

**Input (JSON):**
```json
{
  "name": "Alen",
  "email": "alen@example.com",
  "password": "123456"
}
```

**Output (JSON):**
```json
{
  "_id": "670f1c9b23e1b91f2f56f800",
  "name": "Alen",
  "email": "alen@example.com",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### POST /api/auth/login

➡️ Login user and get token

**Input (JSON):**
```json
{
  "email": "alen@example.com",
  "password": "123456"
}
```

**Output (JSON):**
```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```

# 🗂️ 2. FOLDER ROUTES

All folder routes require JWT in headers:  
`Authorization: Bearer <token>`

### POST /api/folders

➡️ Create a new folder

**Input:**
```json
{
  "title": "AI Research Notes"
}
```

**Output:**
```json
{
  "_id": "670f1f0023e1b91f2f56f804",
  "title": "AI Research Notes",
  "userId": "670f1c9b23e1b91f2f56f800"
}
```

### GET /api/folders

➡️ Get all folders for the logged-in user

**Output:**
```json
[
  {
    "_id": "670f1f0023e1b91f2f56f804",
    "title": "AI Research Notes"
  },
  {
    "_id": "670f1f1123e1b91f2f56f805",
    "title": "Projects"
  }
]
```

### GET /api/folders/:id

➡️ Get a single folder by ID

**Output:**
```json
{
  "_id": "670f1f0023e1b91f2f56f804",
  "title": "AI Research Notes"
}
```

### PUT /api/folders/:id

➡️ Update folder name

**Input:**
```json
{
  "title": "Updated Folder Name"
}
```

**Output:**
```json
{
  "_id": "670f1f0023e1b91f2f56f804",
  "title": "Updated Folder Name"
}
```

### DELETE /api/folders/:id

➡️ Delete a folder

**Output:**
```json
{
  "message": "Folder deleted successfully"
}
```

# 📝 3. NOTE ROUTES

All note routes require JWT in headers:  
`Authorization: Bearer <token>`

### POST /api/notes/:folderId

➡️ Create a new note under a folder

**Input:**
```json
{
  "title": "Understanding Transformers",
  "content": "Transformers are sequence models..."
}
```

**Output:**
```json
{
  "_id": "670f203423e1b91f2f56f810",
  "folderId": "670f1f0023e1b91f2f56f804",
  "title": "Understanding Transformers",
  "content": "Transformers are sequence models..."
}
```

### GET /api/notes/:folderId

➡️ Get all notes inside a specific folder

**Output:**
```json
[
  {
    "_id": "670f203423e1b91f2f56f810",
    "title": "Understanding Transformers",
    "content": "Transformers are sequence models..."
  }
]
```

### GET /api/notes/single/:id

➡️ Get a single note by ID

**Output:**
```json
{
  "_id": "670f203423e1b91f2f56f810",
  "title": "Understanding Transformers",
  "content": "Transformers are sequence models..."
}
```

### PUT /api/notes/:id

➡️ Update note title/content

**Input:**
```json
{
  "title": "Transformers in NLP",
  "content": "Updated content here..."
}
```

**Output:**
```json
{
  "_id": "670f203423e1b91f2f56f810",
  "title": "Transformers in NLP",
  "content": "Updated content here..."
}
```

### DELETE /api/notes/:id

➡️ Delete a note

**Output:**
```json
{
  "message": "Note deleted successfully"
}
```

# 🤖 4. AI SUMMARY ROUTES

### POST /api/notes/:id/summary

➡️ Generate an AI summary for a note (uses Google Studio AI API)

**Output (example):**
```json
{
  "noteId": "670f203423e1b91f2f56f810",
  "summary": {
    "heading": "Transformers in NLP",
    "body": "Transformers use attention mechanisms...",
    "keyPoints": [
      "Based on self-attention",
      "Parallelizable",
      "Revolutionized NLP"
    ]
  }
}
```

# 🧩 5. NODE ROUTES

### POST /api/nodes/:noteId

➡️ Create nodes (key points) for a note based on its summary

**Output:**
```json
[
  {
    "_id": "670f212123e1b91f2f56f830",
    "noteId": "670f203423e1b91f2f56f810",
    "title": "Based on self-attention",
    "snippet": "Transformers use attention mechanisms..."
  }
]
```

### GET /api/nodes/:noteId

➡️ Get all nodes for a note

**Output:**
```json
[
  {
    "_id": "670f212123e1b91f2f56f830",
    "noteId": "670f203423e1b91f2f56f810",
    "title": "Attention mechanism",
    "snippet": "Transformers use attention mechanisms..."
  }
]
```

### PUT /api/nodes/:id

➡️ Update a node

**Input:**
```json
{
  "title": "Updated Node Title",
  "snippet": "Updated Node Content"
}
```

**Output:**
```json
{
  "_id": "670f212123e1b91f2f56f830",
  "title": "Updated Node Title",
  "snippet": "Updated Node Content"
}
```

### DELETE /api/nodes/:id

➡️ Delete a node

**Output:**
```json
{
  "message": "Node deleted successfully"
}
```

# ⏰ 6. TASK SCHEDULER ROUTES

### POST /api/tasks

➡️ Create a new task

**Input:**
```json
{
  "title": "Finish AI project",
  "description": "Complete backend integration",
  "startTime": "2025-10-14T10:00:00Z",
  "endTime": "2025-10-14T12:00:00Z"
}
```

**Output:**
```json
{
  "_id": "670f22f323e1b91f2f56f840",
  "title": "Finish AI project",
  "description": "Complete backend integration",
  "startTime": "2025-10-14T10:00:00Z",
  "endTime": "2025-10-14T12:00:00Z"
}
```

### GET /api/tasks

➡️ Get all tasks for the logged-in user

**Output:**
```json
[
  {
    "_id": "670f22f323e1b91f2f56f840",
    "title": "Finish AI project",
    "description": "Complete backend integration"
  }
]
```

### GET /api/tasks/:id

➡️ Get one task by ID

**Output:**
```json
{
  "_id": "670f22f323e1b91f2f56f840",
  "title": "Finish AI project",
  "description": "Complete backend integration"
}
```

### PUT /api/tasks/:id

➡️ Update a task

**Input:**
```json
{
  "title": "Update AI backend",
  "description": "Fix minor bugs",
  "endTime": "2025-10-14T15:00:00Z"
}
```

**Output:**
```json
{
  "_id": "670f22f323e1b91f2f56f840",
  "title": "Update AI backend",
  "description": "Fix minor bugs"
}
```

### DELETE /api/tasks/:id

➡️ Delete a task

**Output:**
```json
{
  "message": "Task deleted successfully"
}
```

# ✅ Summary of All Endpoints

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Auth     | POST   | /api/auth/register         | Register new user |
| Auth     | POST   | /api/auth/login            | Login user |
| Folders  | POST   | /api/folders               | Create folder |
| Folders  | GET    | /api/folders               | Get all folders |
| Folders  | GET    | /api/folders/:id           | Get single folder |
| Folders  | PUT    | /api/folders/:id           | Update folder |
| Folders  | DELETE | /api/folders/:id           | Delete folder |
| Notes    | POST   | /api/notes/:folderId       | Create note |
| Notes    | GET    | /api/notes/:folderId       | Get all notes in folder |
| Notes    | GET    | /api/notes/single/:id      | Get single note |
| Notes    | PUT    | /api/notes/:id             | Update note |
| Notes    | DELETE | /api/notes/:id             | Delete note |
| Notes    | POST   | /api/notes/:id/summary     | Generate AI summary |
| Nodes    | POST   | /api/nodes/:noteId         | Create nodes |
| Nodes    | GET    | /api/nodes/:noteId         | Get nodes |
| Nodes    | PUT    | /api/nodes/:id             | Update node |
| Nodes    | DELETE | /api/nodes/:id             | Delete node |
| Tasks    | POST   | /api/tasks                 | Create task |
| Tasks    | GET    | /api/tasks                 | Get all tasks |
| Tasks    | GET    | /api/tasks/:id             | Get single task |
| Tasks    | PUT    | /api/tasks/:id             | Update task |
| Tasks    | DELETE | /api/tasks/:id             | Delete task |

