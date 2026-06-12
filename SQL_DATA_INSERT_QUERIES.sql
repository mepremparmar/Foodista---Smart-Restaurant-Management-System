-- 1. Customer
INSERT INTO Customer VALUES
('C001','Aisha Patel','aisha@gmail.com','9876543210','hash1'),
('C002','Rohan Shah','rohan@gmail.com','9876501234','hash2'),
('C003','Meera Iyer','meera@gmail.com','9123456780','hash3'),
('C004','Karan Mehta','karan@gmail.com','9988776655','hash4'),
('C005','Neha Singh','neha@gmail.com','9090909090','hash5'),
('C006','Aarav Jain','aarav@gmail.com','9871234567','hash6'),
('C007','Pooja Desai','pooja@gmail.com','9765432109','hash7'),
('C008','Rahul Verma','rahul@gmail.com','9654321876','hash8');

-- 2. Menu
INSERT INTO Menu VALUES
('M001','Main Menu'),
('M002','Breakfast Menu'),
('M003','Lunch Menu'),
('M004','Dinner Menu'),
('M005','Vegan Menu'),
('M006','Kids Menu'),
('M007','Dessert Menu'),
('M008','Drinks Menu');

-- 3. Reservation_Table
INSERT INTO Reservation_Table VALUES
('T001',2,'Available'),
('T002',4,'Reserved'),
('T003',6,'Available'),
('T004',2,'Reserved'),
('T005',4,'Available'),
('T006',6,'Reserved'),
('T007',8,'Available'),
('T008',2,'Reserved');

-- 4. TimeSlot
INSERT INTO TimeSlot VALUES
('S001','12:00:00','13:00:00'),
('S002','13:00:00','14:00:00'),
('S003','19:00:00','20:00:00'),
('S004','18:00:00','19:00:00'),
('S005','21:00:00','22:00:00'),
('S006','14:00:00','15:00:00'),
('S007','20:00:00','21:00:00'),
('S008','11:00:00','12:00:00');

-- 5. MenuItem
INSERT INTO MenuItem (menuitem_id, menu_id, name, price, description) VALUES
('MI001','M001','Paneer Tikka',250,'Grilled paneer'),
('MI002','M002','Idli',100,'South Indian dish'),
('MI003','M003','Veg Thali',300,'Full meal'),
('MI004','M004','Biryani',350,'Spicy rice'),
('MI005','M005','Salad Bowl',200,'Healthy mix'),
('MI006','M006','Burger',150,'Kids special'),
('MI007','M007','Ice Cream',120,'Dessert'),
('MI008','M008','Cold Coffee',180,'Beverage');

-- 6. Reservation
INSERT INTO Reservation VALUES
('R001','C001','T001','S001','2026-04-01','12:00:00'),
('R002','C002','T002','S002','2026-04-02','13:00:00'),
('R003','C004','T003','S003','2026-04-04','19:00:00'),
('R004','C006','T004','S004','2026-04-06','18:00:00'),
('R005','C007','T005','S005','2026-04-07','21:00:00'),
('R006','C003','T006','S006','2026-04-08','14:00:00'),
('R007','C005','T007','S007','2026-04-09','20:00:00'),
('R008','C008','T008','S008','2026-04-10','11:00:00');

-- 7. Orders
INSERT INTO Orders VALUES
('O001','C001','R001','2026-04-01','12:30:00','Completed',500),
('O002','C002','R002','2026-04-02','13:15:00','Pending',300),
('O003','C003',NULL,'2026-04-03','14:00:00','Completed',450),
('O004','C004','R003','2026-04-04','19:30:00','Completed',600),
('O005','C005',NULL,'2026-04-05','20:15:00','Pending',350),
('O006','C006','R004','2026-04-06','18:45:00','Completed',700),
('O007','C007','R005','2026-04-07','21:10:00','Pending',250),
('O008','C008',NULL,'2026-04-08','11:30:00','Completed',400);

-- 8. Order_Details
INSERT INTO Order_Details VALUES
('OD001','O001','MI001',2,500),
('OD002','O002','MI002',3,300),
('OD003','O003','MI003',1,300),
('OD004','O004','MI004',2,700),
('OD005','O005','MI005',1,200),
('OD006','O006','MI006',2,300),
('OD007','O007','MI007',2,240),
('OD008','O008','MI008',2,360);

-- 9. Feedback
INSERT INTO Feedback VALUES
('F001','C001','O001',5,'Excellent'),
('F002','C002','O002',4,'Good'),
('F003','C003','O003',5,'Very good'),
('F004','C004','O004',3,'Average'),
('F005','C005','O005',4,'Nice'),
('F006','C006','O006',5,'Perfect'),
('F007','C007','O007',3,'Okay'),
('F008','C008','O008',4,'Good');

-- 10. Kitchen_Schedule
INSERT INTO Kitchen_Schedule VALUES
('KS001','O001','12:10:00','12:30:00'),
('KS002','O002','13:05:00','13:25:00'),
('KS003','O003','13:40:00','14:00:00'),
('KS004','O004','19:10:00','19:30:00'),
('KS005','O005','20:00:00','20:20:00'),
('KS006','O006','18:20:00','18:45:00'),
('KS007','O007','20:50:00','21:10:00'),
('KS008','O008','11:10:00','11:30:00');

-- 11. Arrival_Log
INSERT INTO Arrival_Log (arrival_id, actual_arrival_time, reservation_id) VALUES
('A001','12:05:00','R001'),
('A002','13:05:00','R002'),
('A003','19:05:00','R003'),
('A004','18:05:00','R004'),
('A005','21:05:00','R005'),
('A006','14:05:00','R006'),
('A007','20:05:00','R007'),
('A008','11:05:00','R008');

-- 12. Preference
INSERT INTO Preference VALUES
('PREF001','C001','Spicy','Vegetarian'),
('PREF002','C002','Mild','Non-Veg'),
('PREF003','C003','Medium','Vegan'),
('PREF004','C004','Spicy','Non-Veg'),
('PREF005','C005','Mild','Vegetarian'),
('PREF006','C006','Medium','Vegan'),
('PREF007','C007','Spicy','Vegetarian'),
('PREF008','C008','Mild','Non-Veg');

-- 13. Bill
INSERT INTO Bill VALUES
('B001','O001',500,50,20,530),
('B002','O002',300,30,10,320),
('B003','O003',450,45,15,480),
('B004','O004',600,60,25,635),
('B005','O005',350,35,10,375),
('B006','O006',700,70,30,740),
('B007','O007',250,25,5,270),
('B008','O008',400,40,20,420);

-- 14. Payment
INSERT INTO Payment VALUES
('PAY001','B001','UPI','Paid','12:45:00'),
('PAY002','B002','Card','Pending','13:20:00'),
('PAY003','B003','Cash','Paid','14:30:00'),
('PAY004','B004','UPI','Paid','19:40:00'),
('PAY005','B005','Card','Pending','20:30:00'),
('PAY006','B006','Cash','Paid','18:50:00'),
('PAY007','B007','UPI','Pending','21:15:00'),
('PAY008','B008','Card','Paid','11:45:00');




-- 15. Update existing MenuItem data with categories and dietary types
UPDATE MenuItem SET category = 'Starters', dietary_type = 'Vegetarian', image_url = '/images/food/paneer-tikka.jpg' WHERE menuitem_id = 'MI001';
UPDATE MenuItem SET category = 'Breakfast', dietary_type = 'Vegetarian', image_url = '/images/food/idli.jpg' WHERE menuitem_id = 'MI002';
UPDATE MenuItem SET category = 'Main Course', dietary_type = 'Vegetarian', image_url = '/images/food/veg-thali.jpg' WHERE menuitem_id = 'MI003';
UPDATE MenuItem SET category = 'Main Course', dietary_type = 'Non-Veg', image_url = '/images/food/biryani.jpg' WHERE menuitem_id = 'MI004';
UPDATE MenuItem SET category = 'Salads', dietary_type = 'Vegan', image_url = '/images/food/salad-bowl.jpg' WHERE menuitem_id = 'MI005';
UPDATE MenuItem SET category = 'Snacks', dietary_type = 'Vegetarian', image_url = '/images/food/burger.jpg' WHERE menuitem_id = 'MI006';
UPDATE MenuItem SET category = 'Desserts', dietary_type = 'Vegetarian', image_url = '/images/food/ice-cream.jpg' WHERE menuitem_id = 'MI007';
UPDATE MenuItem SET category = 'Beverages', dietary_type = 'Vegetarian', image_url = '/images/food/cold-coffee.jpg' WHERE menuitem_id = 'MI008';

-- 16. Add more menu items for a complete menu
INSERT INTO MenuItem (menuitem_id, menu_id, name, price, description, dietary_type, image_url, category) VALUES
('MI009','M001','Butter Chicken',380,'Creamy butter chicken curry','Non-Veg','/images/food/butter-chicken.jpg','Main Course'),
('MI010','M001','Dal Makhani',220,'Rich black dal','Vegetarian','/images/food/dal-makhani.jpg','Main Course'),
('MI011','M001','Tandoori Roti',40,'Fresh tandoori bread','Vegetarian','/images/food/tandoori-roti.jpg','Breads'),
('MI012','M001','Garlic Naan',60,'Garlic flavored naan','Vegetarian','/images/food/garlic-naan.jpg','Breads'),
('MI013','M003','Fish Curry',320,'Coastal fish curry','Non-Veg','/images/food/fish-curry.jpg','Main Course'),
('MI014','M004','Chicken Tikka',280,'Spiced grilled chicken','Non-Veg','/images/food/chicken-tikka.jpg','Starters'),
('MI015','M007','Gulab Jamun',100,'Sweet milk dumplings','Vegetarian','/images/food/gulab-jamun.jpg','Desserts'),
('MI016','M008','Mango Lassi',120,'Fresh mango yogurt drink','Vegetarian','/images/food/mango-lassi.jpg','Beverages'),
('MI017','M005','Mushroom Risotto',260,'Creamy Italian risotto','Vegan','/images/food/mushroom-risotto.jpg','Main Course'),
('MI018','M002','Masala Dosa',130,'Crispy South Indian crepe','Vegetarian','/images/food/masala-dosa.jpg','Breakfast'),
('MI019','M006','Cheese Pizza',200,'Kids favorite pizza','Vegetarian','/images/food/cheese-pizza.jpg','Snacks'),
('MI020','M008','Fresh Lime Soda',80,'Refreshing lime drink','Vegan','/images/food/lime-soda.jpg','Beverages');

-- 17. Update existing customer password hashes with bcrypt hashes
-- (These are bcrypt hashes of 'password123')
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C001';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C002';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C003';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C004';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C005';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C006';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C007';
UPDATE Customer SET password_hash = '$2a$12$LJ3m4ys3xZ3vJ5sKJgKZxOQQZ5vN1YJxqJ6K7fR5t4dH8wM2nPuiy' WHERE customer_id = 'C008';


