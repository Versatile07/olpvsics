# VSICS — Institutional Accounts & Subject Reference

> **Confidential** — Keep this document secure. Contains all login credentials and subject assignments.

---

## 🔑 General Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| Administrator | admin@vsics.edu | `lavi$h.07` | Full System Access (Users, Placements, Notices) |
| Student | rahul@vsics.edu | `lavi5h.07` | Student Dashboard (Notes, Attendance, Assignments) |

---

## 👨‍🏫 Faculty Accounts

> Each faculty member can only upload notes/assignments for the subjects assigned to them.

| Faculty Name | Email | Password | Assigned Subjects (Semester) |
|---|---|---|---|
| Dr. Rekh Nath Singh | rekh@vsics.edu | `RekhBCA402` | DBMS (4), OS (3), C++ (2) |
| Mr. Iqbal Masood | iqbal@vsics.edu | `IqbalBCA102` | C Programming (1), Data Structures (2), Fundamentals (1) |
| Mr. Ram Awtar | ram@vsics.edu | `RamBCA501` | Java (5), Computer Networks (5), Web Tech (3) |
| Dr. Aparna Shukla | aparna@vsics.edu | `AparnaBCA103` | Management (1), Comm (1), Accounts (2) |
| Mr. Nitin Mishra | nitin@vsics.edu | `NitinBCA405` | Cyber Security (4), Software Eng (3), E-Commerce (6), Info Security (6) |
| Mr. Ashish Kumar | ashish@vsics.edu | `AshishBCA105` | Mathematics I (1), II (2), III (4), Numerical (5), Optimization (4) |
| Mr. Sanjay Tiwari | sanjay@vsics.edu | `SanjayBCA601` | Major Project (6), Minor Project (5), Computer Org (2) |
| Mrs. Shweta Shukla | shweta@vsics.edu | `ShwetaBCA301` | Python (3), Emerging Tech (3), Computer Graphics (4) |

---

## 🎓 Subject & Semester Reference

### Semester 1
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 1 | C Programming | Mr. Iqbal Masood |
| 2 | Fundamentals of Computers | Mr. Iqbal Masood |
| 3 | Management | Dr. Aparna Shukla |
| 4 | Mathematics I | Mr. Ashish Kumar |
| 5 | Communication Skills | Dr. Aparna Shukla |

### Semester 2
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 6 | C++ Programming | Dr. Rekh Nath Singh |
| 7 | Data Structures | Mr. Iqbal Masood |
| 8 | Mathematics II | Mr. Ashish Kumar |
| 9 | Accounts | Dr. Aparna Shukla |
| 10 | Computer Organization | Mr. Sanjay Tiwari |

### Semester 3
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 11 | Python Programming | Mrs. Shweta Shukla |
| 12 | Operating Systems | Dr. Rekh Nath Singh |
| 13 | Web Technologies | Mr. Ram Awtar |
| 14 | Software Engineering | Mr. Nitin Mishra |
| 15 | Emerging Technologies | Mrs. Shweta Shukla |

### Semester 4
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 16 | DBMS | Dr. Rekh Nath Singh |
| 17 | Computer Graphics | Mrs. Shweta Shukla |
| 18 | Mathematics III | Mr. Ashish Kumar |
| 19 | Optimization Techniques | Mr. Ashish Kumar |
| 20 | Cyber Security | Mr. Nitin Mishra |

### Semester 5
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 21 | Java Programming | Mr. Ram Awtar |
| 22 | Computer Networks | Mr. Ram Awtar |
| 23 | Numerical Methods | Mr. Ashish Kumar |
| 24 | Minor Project | Mr. Sanjay Tiwari |

### Semester 6
| Subject ID | Subject Name | Faculty |
|---|---|---|
| 25 | Major Project | Mr. Sanjay Tiwari |
| 26 | Information Security | Mr. Nitin Mishra |
| 27 | E-Commerce | Mr. Nitin Mishra |

---

## 🗄️ Database User IDs (after seed)

| ID | Name | Role | Email |
|---|---|---|---|
| 1 | Administrator | admin | admin@vsics.edu |
| 2 | Rahul | student | rahul@vsics.edu |
| 3 | Dr. Rekh Nath Singh | faculty | rekh@vsics.edu |
| 4 | Mr. Iqbal Masood | faculty | iqbal@vsics.edu |
| 5 | Mr. Ram Awtar | faculty | ram@vsics.edu |
| 6 | Dr. Aparna Shukla | faculty | aparna@vsics.edu |
| 7 | Mr. Nitin Mishra | faculty | nitin@vsics.edu |
| 8 | Mr. Ashish Kumar | faculty | ashish@vsics.edu |
| 9 | Mr. Sanjay Tiwari | faculty | sanjay@vsics.edu |
| 10 | Mrs. Shweta Shukla | faculty | shweta@vsics.edu |

---

## 🔐 Security Notes

- Passwords are stored as **bcrypt hashes** (10 rounds) in the database — never plaintext
- Faculty are identified by their **user ID** when marking attendance or uploading resources
- The `subject_id` column references the Subject IDs listed above
- To reset a password, run the migration again after updating `USER_PASSWORDS` in `migrate.js`

---

## Quick Login Reference Card

```
Admin:    admin@vsics.edu   / lavi$h.07
Student:  rahul@vsics.edu   / lavi5h.07
---
Dr. Rekh:  rekh@vsics.edu   / RekhBCA402
Mr. Iqbal: iqbal@vsics.edu  / IqbalBCA102
Mr. Ram:   ram@vsics.edu    / RamBCA501
Dr. Aparna:aparna@vsics.edu / AparnaBCA103
Mr. Nitin: nitin@vsics.edu  / NitinBCA405
Mr. Ashish:ashish@vsics.edu / AshishBCA105
Mr. Sanjay:sanjay@vsics.edu / SanjayBCA601
Mrs. Shweta:shweta@vsics.edu/ ShwetaBCA301
```
