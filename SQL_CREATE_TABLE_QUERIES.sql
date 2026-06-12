-- 1. Customer
CREATE TABLE Customer (
    customer_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. Menu
CREATE TABLE Menu (
    menu_id VARCHAR(10) PRIMARY KEY,
    menu_name VARCHAR(100) NOT NULL
);

-- 3. Reservation_Table
CREATE TABLE Reservation_Table (
    table_id VARCHAR(10) PRIMARY KEY,
    seating_capacity INT NOT NULL CHECK (seating_capacity > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Available','Reserved'))
);

-- 4. TimeSlot
CREATE TABLE TimeSlot (
    slot_id VARCHAR(10) PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (end_time > start_time)
);

-- 5. MenuItem
CREATE TABLE MenuItem (
    menuitem_id VARCHAR(10) PRIMARY KEY,
    menu_id VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL CHECK (price > 0),
    description VARCHAR(255),
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- 6. Reservation
CREATE TABLE Reservation (
    reservation_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    table_id VARCHAR(10) NOT NULL,
    slot_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (table_id) REFERENCES Reservation_Table(table_id),
    FOREIGN KEY (slot_id) REFERENCES TimeSlot(slot_id)
);

-- 7. Order
CREATE TABLE Orders (
    order_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    reservation_id VARCHAR(10),
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending','Completed','Cancelled')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);

-- 8. Order_Details
CREATE TABLE Order_Details (
    order_detail_id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    menuitem_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (menuitem_id) REFERENCES MenuItem(menuitem_id)
);

-- 9. Feedback
CREATE TABLE Feedback (
    feedback_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    order_id VARCHAR(10) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- 10. Kitchen_Schedule
CREATE TABLE Kitchen_Schedule (
    schedule_id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    cooking_start_time TIME NOT NULL,
    expected_completion_time TIME NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    CHECK (expected_completion_time > cooking_start_time)
);

-- 11. Arrival_Log
CREATE TABLE Arrival_Log (
    arrival_id VARCHAR(10) PRIMARY KEY,
    reservation_id VARCHAR(10) NOT NULL,
    actual_arrival_time TIME NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);

-- 12. Preference
CREATE TABLE Preference (
    preference_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    taste_preference VARCHAR(100),
    dietary_choice VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

-- 13. Bill
CREATE TABLE Bill (
    bill_id VARCHAR(10) PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(8,2) NOT NULL,
    discount DECIMAL(8,2) DEFAULT 0,
    final_payable DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

-- 14. Payment
CREATE TABLE Payment (
    payment_id VARCHAR(10) PRIMARY KEY,
    bill_id VARCHAR(10) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('Cash','Card','UPI')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('Paid','Pending')),
    payment_time TIME NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES Bill(bill_id)
);

-- 15. Create Cart table
CREATE TABLE IF NOT EXISTS Cart (
    cart_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    menuitem_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (menuitem_id) REFERENCES MenuItem(menuitem_id)
);

-- 16. Create Collection table
CREATE TABLE IF NOT EXISTS Collection (
    collection_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10) NOT NULL,
    menuitem_id VARCHAR(10) NOT NULL,
    added_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (menuitem_id) REFERENCES MenuItem(menuitem_id)
);

-- 17. Create email table for Contact messages
CREATE TABLE IF NOT EXISTS email (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- 1. Extend Customer table
ALTER TABLE Customer ADD COLUMN profile_photo TEXT DEFAULT NULL;
ALTER TABLE Customer ADD COLUMN dob DATE DEFAULT NULL;
ALTER TABLE Customer ADD COLUMN gender VARCHAR(10) DEFAULT NULL;
ALTER TABLE Customer ADD COLUMN theme VARCHAR(10) DEFAULT 'dark';

-- 2. Extend Orders table
ALTER TABLE Orders ADD COLUMN scheduled_time TIME DEFAULT NULL;
ALTER TABLE Orders ADD COLUMN tracking_status VARCHAR(20) DEFAULT 'Received';

-- 3. Extend MenuItem table
ALTER TABLE MenuItem ADD COLUMN image_url TEXT DEFAULT NULL;
ALTER TABLE MenuItem ADD COLUMN category VARCHAR(50) DEFAULT NULL;
ALTER TABLE MenuItem ADD COLUMN dietary_type VARCHAR(20) DEFAULT NULL;