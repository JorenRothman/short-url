CREATE TABLE `urls` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`url` varchar(256),
	`slug` varchar(32),
	`timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `urls_id` PRIMARY KEY(`id`),
	CONSTRAINT `urls_slug_unique` UNIQUE(`slug`)
);
