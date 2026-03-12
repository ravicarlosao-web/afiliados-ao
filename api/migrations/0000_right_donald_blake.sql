CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`plan` text NOT NULL,
	`status` text DEFAULT 'em_analise' NOT NULL,
	`affiliate_id` text NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`commission` integer DEFAULT 0 NOT NULL,
	`company_name` text,
	`contact_person` text,
	`social_media` text,
	`admin_note` text,
	`site_started` integer DEFAULT false,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`affiliate_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `conversation_screenshots` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_id` text NOT NULL,
	`client_id` text,
	`image_url` text NOT NULL,
	`cloudinary_public_id` text NOT NULL,
	`message` text,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`affiliate_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`content` text,
	`image_url` text,
	`cloudinary_public_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`type` text DEFAULT 'info' NOT NULL,
	`target_role` text,
	`target_user_id` text,
	`channels` text,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `security_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`user_id` text,
	`user_label` text,
	`ip` text,
	`status` text DEFAULT 'success' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`iban` text,
	`multicaixa_express` text,
	`referral_code` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE TABLE `withdrawals` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_id` text NOT NULL,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`account_info` text,
	`status` text DEFAULT 'pendente' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`affiliate_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
