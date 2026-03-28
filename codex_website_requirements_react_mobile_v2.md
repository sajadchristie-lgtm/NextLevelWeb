# Codex Prompt — Mobile-Friendly Car Sales + Car Services Website

Build a full-stack, production-ready website for a business that has **two main offerings**:
1. **Cars for Sale**
2. **Car Care / Detailing Services**

The website must have a **simple, minimalistic, modern UI** with a premium automotive feel.

## Core Goal
Create a website where customers can:
- Browse cars for sale
- View car details and pricing
- See discounted cars clearly
- Explore the business services
- Learn about the business
- View business location details
- Contact the business easily
- Use the site comfortably on **mobile, tablet, and desktop**

Create an **admin dashboard** where the admin can:
- Log in securely
- Add, edit, and delete cars
- Upload car photos
- Add discounts to cars
- Mark cars as featured / available / sold
- Manage service content
- Manage About, Location, and Contact page content

---

## Required Tech Stack
Use this stack unless there is a strong implementation reason not to:

### Frontend
- **React**
- **TypeScript**
- **Vite** (preferred for simplicity)
- **Tailwind CSS** for styling
- Modern reusable UI components
- **React Router** for routing

### Backend
- **Node.js + Express**
- REST API for admin and public data

### Database
- **SQLite** for a simple database setup
- **Prisma ORM** for schema and database access

### Authentication
- Simple secure admin authentication
- Session-based auth or JWT, whichever is cleanest and secure
- Only admin users can access the dashboard

### Image Handling
- Admin uploads car images from the dashboard
- Car images must be persisted and linked to each car record
- For simplicity, store the **image file path / URL and metadata in the database**
- Image files themselves can be stored in a local uploads folder for MVP, with clean structure
- Support multiple images per car
- Show image preview before saving if practical

> Important: keep the implementation simple and easy to run locally. This is an MVP, so prioritize maintainability over enterprise complexity.

---

## Design Direction
The UI should be:
- Minimalistic
- Modern
- Clean
- Mobile-first
- Responsive on all screen sizes
- Professional and premium
- Easy to scan
- Light and visually balanced

### Design notes
- Use a neutral color palette with one elegant accent color
- Clean hero section
- Card-based layout for cars and services
- Rounded corners
- Soft shadows
- Plenty of whitespace
- Strong typography hierarchy
- Clean buttons and form inputs
- Smooth interactions without excessive animation

---

## Mobile Responsiveness Requirements
This is very important.

The website must be **mobile friendly first**, not only desktop friendly.

### Mobile requirements
- Mobile-first layout approach
- Responsive navbar with hamburger menu on smaller screens
- Car cards must stack cleanly on phones
- Service cards must be readable on smaller screens
- Admin dashboard must also be usable on mobile/tablet
- Forms must work well on touch devices
- Buttons should be large enough for tap interactions
- Image galleries must be responsive
- Tables in admin should adapt well on smaller screens (stacked layout or horizontal scroll if needed)

---

## Public Website Structure
Create the public website with the following main sections/pages in the navigation:
- **Home**
- **Cars for Sale**
- **Services**
- **About**
- **Location**
- **Contact**

### Suggested routes
- `/`
- `/cars`
- `/cars/:id` or `/cars/:slug`
- `/services`
- `/about`
- `/location`
- `/contact`

### 1. Home Page
The homepage should include:
- Hero section with business headline, short supporting text, and CTA buttons
- Featured cars preview
- Services overview preview
- Short About preview
- Location preview
- Contact CTA section
- “Why choose us” section

### 2. Cars for Sale Page
Display all available cars in a modern responsive grid.

Each car card should show:
- Main image
- Car title
- Brand / model
- Year
- Price
- Discount badge if applicable
- Final discounted price if applicable
- Short specs
- Button to view details

Include filtering/sorting if practical:
- By brand
- By year
- By price
- By availability
- Sort by newest / price low to high / price high to low

### 3. Car Details Page
Each car should have a dedicated page with:
- Responsive image gallery
- Full title
- Price
- Discount info
- Specs
- Description
- Mileage
- Fuel type
- Transmission
- Color
- Condition
- Availability status
- Inquiry CTA

### 4. Services Page
Create a clean services page for the following services.
Use professional service cards with short descriptions.

## Services Content
### Exterior Car Wash
A detailed wash that removes dirt, grime, and restores shine with long-lasting results.

### Interior Cleaning
Deep cleaning of seats, carpets, and interior surfaces to make your car feel fresh again.

### Full Car Reconditioning
Complete interior + exterior treatment including:
- Deep cleaning
- Paint care
- Surface restoration

### Polishing & Waxing
Enhance your car’s shine while protecting the paint.

### Paint Protection
Advanced treatment to protect your car from weather, dirt, and wear.

### 5. About Page
Create an About page that presents the business in a clean, trustworthy, modern way.
It should include:
- Business introduction
- Mission / values
- Why customers should choose this business
- Optional owner/team intro section
- Optional before/after visual section if practical

The admin should be able to edit this content from the dashboard.

### 6. Location Page
Create a dedicated Location page that includes:
- Business address
- Embedded map if practical
- Working hours
- Directions/helpful location notes
- Phone/contact shortcuts

The admin should be able to edit location details from the dashboard.

### 7. Contact Page
Create a Contact page that includes:
- Contact form
- Phone number
- Email
- WhatsApp link if practical
- Business hours
- Quick links to cars/services

The admin should be able to edit the displayed contact information from the dashboard.

---

## Admin Dashboard Requirements
Create a protected admin dashboard.
Only authenticated admin users should have access.

### Admin features
#### Car Management
Admin must be able to:
- Add a new car
- Edit a car
- Delete a car
- Upload one or multiple images for each car
- Remove or reorder images
- Set a main/cover image
- Set car as featured
- Set status: available / sold / hidden
- Add car specifications
- Add description

#### Discount Management
Admin must be able to:
- Add a discount to a car
- Choose discount type:
  - Percentage discount
  - Fixed amount discount
- Set discount start date and end date
- Display original price and discounted price automatically
- Turn discount on/off easily

#### Content Management
Admin should be able to manage the public content for:
- **Services**
- **About**
- **Location**
- **Contact**

This can be implemented either as separate content records or as simple editable page sections.

#### Service Content Management
Admin should be able to:
- Edit service title
- Edit service description
- Change service order
- Enable/disable service visibility

#### About Content Management
Admin should be able to:
- Edit About page heading
- Edit About description/content blocks
- Edit mission/values section
- Enable/disable optional sections

#### Location Content Management
Admin should be able to:
- Edit address
- Edit map/embed link
- Edit business hours
- Edit location notes

#### Contact Content Management
Admin should be able to:
- Edit phone number
- Edit email
- Edit WhatsApp link
- Edit contact form recipient email
- Edit business hours shown on contact page

### Dashboard UI
The dashboard should include:
- Login page
- Sidebar or clean navigation
- Overview cards/statistics
- Cars table/list
- Add/Edit car form
- Discount controls
- Image upload support
- Content management area for Services/About/Location/Contact
- Responsive admin layout

---

## Data Model Requirements
Create a clean and simple database schema.

### Car
- id
- title
- brand
- model
- year
- price
- description
- mileage
- fuelType
- transmission
- color
- condition
- status
- featured (boolean)
- createdAt
- updatedAt

### CarImage
- id
- carId
- imageUrl
- imageName
- altText
- sortOrder
- isCover
- createdAt

### Discount
- id
- carId
- type (percentage or fixed)
- value
- isActive
- startDate
- endDate
- createdAt

### Service
- id
- title
- slug
- description
- order
- isActive
- createdAt
- updatedAt

### SiteContent
Use a simple content table for editable static sections/pages.
Suggested fields:
- id
- key
- title
- content
- jsonData (optional for structured data like address, hours, phone, map link)
- isActive
- createdAt
- updatedAt

Suggested content keys:
- about_page
- location_page
- contact_page
- homepage_sections

### AdminUser
- id
- email
- passwordHash
- role
- createdAt

---

## Important Database / Upload Note
Because this project should stay simple:
- Use **SQLite** as the database
- Store car/image/service/content/admin data in SQLite
- Store **image references (file path / URL / filename / metadata)** in the database
- Store actual uploaded image files in a structured uploads folder
- Make sure deleting a car also handles related image records correctly

If Codex prefers a slightly more scalable alternative, PostgreSQL is acceptable, but **SQLite is preferred for simplicity**.

---

## Functional Requirements
- Fully responsive layout
- Excellent mobile usability
- Clean routing
- Fast-loading UI
- Form validation for admin inputs
- Error handling for admin actions
- Loading states and empty states
- Clean reusable components
- Accessible buttons and form labels
- Image upload validation (type/size)
- Proper handling of missing images
- Editable public content pages from admin dashboard

---

## Non-Functional Requirements
- Clean, modular, maintainable code
- TypeScript used properly
- Reusable UI components
- Consistent styling
- No unnecessary complexity
- Clear project folder structure
- Easy local setup
- Practical architecture for future expansion

---

## Pricing / Discount Logic
Implement clear discount behavior:
- If no discount exists, show normal price only
- If discount is active, show:
  - Original price with strikethrough
  - Discounted price prominently
  - Discount badge (example: “10% OFF” or “$1000 OFF”)
- If discount dates are provided, only apply the discount while active
- Prevent negative final price

---

## Seed / Demo Content
Provide seed/demo data including:
- At least 6 sample cars
- The 5 services listed above
- Sample About content
- Sample Location content
- Sample Contact content
- A sample admin account for development

---

## Deliverables
Generate the complete project with:
1. Full source code
2. Database schema and migrations
3. Seed script
4. Admin authentication
5. Public website pages
6. Admin dashboard pages
7. Image upload implementation
8. README with setup instructions
9. `.env.example`

---

## README Requirements
The README should explain:
- Tech stack
- How to install dependencies
- How to configure environment variables
- How to run migrations
- How to seed the database
- How to run frontend and backend locally
- How image uploads are stored
- Default admin credentials for development only

---

## Nice-to-Have Features
If time allows, also include:
- Search bar for car listings
- Featured cars carousel
- Toast notifications in admin dashboard
- Image preview before upload
- Simple analytics cards in admin dashboard
- Contact / inquiry form submission handling
- Google Maps embed on Location page

---

## Final Instruction for Codex
Build this as a polished MVP that feels like a real business website.

Prioritize, in order:
1. Clean modern UI
2. Mobile responsiveness
3. React frontend quality
4. Admin usability
5. Car listing management
6. Discount management
7. Simple maintainable backend and database
8. Editable public content pages

Do not overengineer the project. Keep it elegant, practical, and easy to run locally.
