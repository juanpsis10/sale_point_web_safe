CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"email"	TEXT,
	"role"	TEXT DEFAULT 'employee' CHECK("role" IN ('admin', 'employee')),
	"state"	TEXT DEFAULT 'active' CHECK("state" IN ('active', 'disable')),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "client" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"phone"	TEXT,
	"document"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "branch" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"location"	TEXT NOT NULL,
	"manager"	TEXT,
	"phone"	TEXT,
	"state"	TEXT DEFAULT 'active' CHECK("state" IN ('active', 'disabled')),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "product" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"description"	TEXT,
	"code"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "product_branch" (
	"product_id"	INTEGER,
	"branch_id"	INTEGER,
	"stock_quantity"	INTEGER,
	"price"	REAL NOT NULL,
	"state"	TEXT DEFAULT 'active' CHECK("state" IN ('active', 'disable')),
	PRIMARY KEY("product_id","branch_id"),
	FOREIGN KEY("product_id") REFERENCES "product"("id"),
	FOREIGN KEY("branch_id") REFERENCES "branch"("id")
);
CREATE TABLE IF NOT EXISTS "sale" (
	"id"	INTEGER,
	"client_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"date"	DATETIME NOT NULL,
	"total"	REAL NOT NULL,
	"branch_id"	INTEGER NOT NULL,
	"product_id"	INTEGER NOT NULL,
	"document_number"	INTEGER NOT NULL,
	"cantidad_producto"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("client_id") REFERENCES "client"("id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id"),
	FOREIGN KEY("product_id") REFERENCES "product"("id"),
	FOREIGN KEY("branch_id") REFERENCES "branch"("id")
);
INSERT INTO "user" ("id","username","password","email","role","state") VALUES (1,'admin','admin',NULL,'admin','active');
INSERT INTO "client" ("id","name","phone","document") VALUES (1,'Sin Nombre','999999999','11111111');
INSERT INTO "branch" ("id","name","location","manager","phone","state") VALUES (2,'Juegos Tarma','Tarma','Tom','912374653','active');
INSERT INTO "product" ("id","name","description","code") VALUES (13,'Ticket Kamizake','Ticket Kamizake','KAZ-000001'),
 (14,'Ticket Piramide','Ticket Pirámide','PIR-000001'),
 (15,'Ticket Carrucel','Ticket Carrucel','CRL-000001'),
 (16,'Ticket Piscina','Ticket Piscina','PSN-000001'),
 (17,'Ticket Estrategia','Ticket Estrategia','STR-000001'),
 (18,'Ticket Trencito','Ticket Trencito','TRN-000001'),
 (19,'Ticket Globo','Ticket Globo','GLB-000001'),
 (20,'Ticket Fulbito','Ticket Fulbito','FBT-000001');
INSERT INTO "product_branch" ("product_id","branch_id","stock_quantity","price","state") VALUES (13,2,999998,7.0,'active'),
 (14,2,999999,7.0,'active'),
 (15,2,999999,5.0,'active'),
 (16,2,999999,5.0,'active'),
 (17,2,999999,5.0,'active'),
 (18,2,999999,5.0,'active'),
 (19,2,999999,5.0,'active'),
 (20,2,999999,2.0,'active');
INSERT INTO "sale" ("id","client_id","user_id","date","total","branch_id","product_id","document_number","cantidad_producto") VALUES (65,1,1,'2/24/2024, 2:38:23 AM',7.0,2,13,1,1);
COMMIT;
