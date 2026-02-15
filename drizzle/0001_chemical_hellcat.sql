CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`strain` varchar(64) NOT NULL,
	`strainName` text NOT NULL,
	`categoryName` varchar(64) NOT NULL,
	`packagingType` varchar(20) NOT NULL,
	`packages` json NOT NULL,
	`neededAmount` decimal(10,2) NOT NULL,
	`status` enum('offen','in_bearbeitung','fertig') NOT NULL DEFAULT 'offen',
	`remainder` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stock` (
	`id` varchar(64) NOT NULL,
	`category` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`hersteller` text,
	`menge` decimal(10,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wareneingaenge` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`strain` varchar(64) NOT NULL,
	`menge` decimal(10,2) NOT NULL,
	`lieferant` text,
	`chargenNr` varchar(100),
	`category` varchar(64) NOT NULL,
	`strainName` text NOT NULL,
	`categoryName` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wareneingaenge_id` PRIMARY KEY(`id`)
);
