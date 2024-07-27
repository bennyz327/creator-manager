-- sqlite3

CREATE TABLE "creators" (
	"id"	INTEGER NOT NULL UNIQUE,
	"start_at"	TEXT,
	"end_at"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "creator_identities" (
	"creator_id"	INTEGER NOT NULL,
	"display_name"	TEXT NOT NULL,
	"scoped_id"	INTEGER NOT NULL,
	"scoped_name"	TEXT NOT NULL,
	PRIMARY KEY("scoped_name","scoped_id","display_name"),
	CONSTRAINT "creator_target" FOREIGN KEY("creator_id") REFERENCES "creators"("id")
);

CREATE TABLE "product_types" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);