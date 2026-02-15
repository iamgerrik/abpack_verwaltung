CREATE TABLE `stockHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stockId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`action` enum('order_created','order_cancelled','warehouse_entry','manual_adjustment') NOT NULL,
	`previousAmount` decimal(10,2) NOT NULL,
	`newAmount` decimal(10,2) NOT NULL,
	`changeAmount` decimal(10,2) NOT NULL,
	`reason` text,
	`orderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stockHistory_id` PRIMARY KEY(`id`)
);
