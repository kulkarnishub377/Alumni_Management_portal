# 🔄 Process Flows & Sequence Diagrams

This document outlines the core transactional workflows of the Alumni Management Portal, visualizing the interactions between Users, the Frontend App, the Backend REST API, and the PostgreSQL database.

---

## 1. User Registration & Verification Flow

A new user cannot access the system immediately upon registration. They must go through a validation process where their academic details are approved by a Mentor or Coordinator of their respective department.

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Registering User
    participant FE as Frontend Client
    participant API as Django REST API
    participant DB as PostgreSQL Database
    actor Mentor as Mentor / Coordinator

    Guest->>FE: Fill Multi-step Registration Form
    FE->>FE: Validate Fields (frontend check)
    FE->>API: POST /api/users/ (Payload + role + department)
    API->>API: Hash Password (PBKDF2)
    API->>API: Set status = "pending", is_active = True
    API->>DB: INSERT INTO api_user
    DB-->>API: Success (User ID Created)
    API-->>FE: 201 Created (Success Message)
    FE->>Guest: Redirect to Login (Display: "Approval Pending")

    Note over FE, Mentor: Mentor Verification phase
    
    Mentor->>FE: Access Approvals Dashboard
    FE->>API: GET /api/users/?status=pending
    API->>DB: SELECT FROM api_user WHERE status = 'pending'
    DB-->>API: List of users
    API-->>FE: 200 OK (User profiles array)
    FE->>Mentor: Render Pending Registrations
    Mentor->>FE: Click "Approve User"
    FE->>API: POST /api/users/{id}/approve/
    API->>DB: UPDATE api_user SET status = 'approved'
    DB-->>API: Saved
    API-->>FE: 200 OK (User Approved)
    FE->>Mentor: Update UI list (Remove approved user)
```

---

## 2. Mentorship Request & Assignment Pipeline

Alumni can request mentorship from registered and verified Mentors. The mentor has a capacity constraint (`max_mentees`) that is validated server-side.

```mermaid
sequenceDiagram
    autonumber
    actor Alumni as Alumni (Mentee)
    participant FE as Frontend Client
    participant API as Django REST API
    participant DB as PostgreSQL Database
    actor Mentor as Mentor

    Alumni->>FE: Browse Mentors List
    FE->>API: GET /api/profiles/mentors/
    API->>DB: SELECT FROM api_mentorprofile
    DB-->>API: Active mentors list
    API-->>FE: 200 OK
    FE->>Alumni: Display Mentors with specialty & availability
    Alumni->>FE: Click "Request Mentorship" (Add Message)
    FE->>API: POST /api/mentorship-requests/ (mentee_id, mentor_id, message)
    API->>API: Check unique_together (mentee, mentor) constraint
    API->>DB: INSERT INTO api_mentorshiprequest (status = 'pending')
    DB-->>API: Success
    API-->>FE: 201 Created
    FE->>Alumni: Display: "Request Sent"

    Note over FE, Mentor: Mentor Action phase

    Mentor->>FE: Open Mentorship Requests
    FE->>API: GET /api/pages/dashboard/mentor/
    API->>DB: SELECT * FROM api_mentorshiprequest WHERE mentor = current_user
    DB-->>API: Request models
    API-->>FE: 200 OK
    FE->>Mentor: Render requests with "Approve" & "Reject" options
    Mentor->>FE: Click "Approve Request"
    FE->>API: POST /api/mentorship-requests/{id}/approve/
    API->>API: Fetch MentorProfile capacity
    API->>API: Assert active_mentees < max_mentees
    alt Limit Reached
        API-->>FE: 400 Bad Request ("Capacity Limit Reached")
        FE->>Mentor: Toast Alert: "Cannot approve. Limit reached."
    else Has Capacity
        API->>DB: UPDATE api_mentorshiprequest SET status = 'approved'
        API->>DB: UPDATE api_mentorprofile SET active_mentees = active_mentees + 1
        DB-->>API: Saved
        API-->>FE: 200 OK ("Approved")
        FE->>Mentor: Toast Success: "Mentee accepted!"
    end
```

---

## 3. Job Posting Approval Pipeline

To ensure the job board remains spam-free, job postings go through a multi-step approval pipeline.

```mermaid
flowchart TD
    A[Alumni/Mentor creates job] --> B(Status: pending_coordinator)
    B --> C{Coordinator Review}
    C -- Rejects --> D[Status: rejected]
    C -- Approves --> E[Status: pending_admin]
    E --> F{Admin Review}
    F -- Rejects --> D
    F -- Approves --> G[Status: approved]
    G --> H[Rendered on Job Board]
```

### Flow Details:
1. **Creation:** An alumni or mentor posts a job. The API automatically sets `status = 'pending_coordinator'`.
2. **First Gate (Coordinator):** The coordinator reviews job listings posted by alumni within their own department. They call `POST /api/jobs/{id}/approve_job/`, which shifts the job state to `pending_admin`.
3. **Second Gate (Admin):** The global admin reviews the job. Approving it changes the status to `approved`, making it public.
4. **Rejection:** Either the coordinator or the admin can reject the job at any stage, moving the state directly to `rejected`.

---

## 4. Messaging & Toast Notification Dispatch

The platform implements 1:1 messaging. The client updates conversation interfaces dynamically.

```mermaid
sequenceDiagram
    autonumber
    actor A as User A (Sender)
    participant FEA as FE Client A
    participant API as Django REST API
    participant DB as PostgreSQL Database
    participant FEB as FE Client B
    actor B as User B (Receiver)

    A->>FEA: Type message & click "Send"
    FEA->>FEA: Render bubble in chat immediately (optimistic UI)
    FEA->>API: POST /api/messages/ (receiver_id, content)
    API->>DB: INSERT INTO api_message (read_status = False)
    DB-->>API: Saved (Timestamp created)
    API-->>FEA: 201 Created (Message Model)
    FEA->>FEA: Update message status to "delivered"

    Note over FEB, B: User B receives message (polling or dynamic fetch)
    
    FEB->>API: GET /api/pages/dashboard/alumni/ (or messages view)
    API->>DB: SELECT COUNT(*) FROM api_message WHERE receiver = B AND read_status = False
    DB-->>API: count = 1
    API-->>FEB: Response contains unread_messages = 1
    FEB->>FEB: Trigger Toast: "New message from User A"
    FEB->>FEB: Update sidebar badge count
    B->>FEB: Open conversation with User A
    FEB->>API: PATCH /api/messages/{id}/mark_read/
    API->>DB: UPDATE api_message SET read_status = True WHERE id = {id}
    DB-->>API: Saved
    API-->>FEB: 200 OK
    FEB->>FEB: Remove unread styling / update badge
```
