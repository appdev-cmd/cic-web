-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th7 28, 2026 lúc 10:30 AM
-- Phiên bản máy phục vụ: 10.6.22-MariaDB-cll-lve
-- Phiên bản PHP: 8.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cic14005_cic_fs`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_address`
--

CREATE TABLE `fs_address` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `more_info` text DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `show_contact` tinyint(4) DEFAULT 0,
  `show_home` tinyint(4) DEFAULT 0,
  `map` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_address_en`
--

CREATE TABLE `fs_address_en` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `more_info` text DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `show_contact` tinyint(4) DEFAULT 0,
  `show_home` tinyint(4) DEFAULT 0,
  `map` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_application`
--

CREATE TABLE `fs_application` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_application_en`
--

CREATE TABLE `fs_application_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_areas`
--

CREATE TABLE `fs_areas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `parent_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_banners`
--

CREATE TABLE `fs_banners` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` int(4) DEFAULT NULL COMMENT '0: images/flash; 1: content',
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `flash` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `width` int(11) NOT NULL DEFAULT 0,
  `height` int(11) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `news_categories` varchar(255) DEFAULT NULL,
  `news_categories_alias` varchar(255) DEFAULT NULL,
  `products_categories` varchar(255) DEFAULT NULL,
  `products_categories_alias` varchar(255) DEFAULT NULL,
  `listItemid` varchar(255) DEFAULT NULL,
  `contents_categories` varchar(255) DEFAULT NULL,
  `contents_categories_alias` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `order_id` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT 0,
  `order_id_item` int(11) DEFAULT 0,
  `total_usage` int(11) DEFAULT 0,
  `days` int(11) DEFAULT 0,
  `is_use` tinyint(4) DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `check_link` int(11) DEFAULT 1,
  `is_types` tinyint(4) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  `user_admin_name` varchar(255) DEFAULT NULL,
  `link_video` varchar(255) DEFAULT NULL,
  `user_admin` int(11) DEFAULT 0,
  `el_user_name` varchar(255) DEFAULT NULL,
  `el_info` text DEFAULT NULL,
  `el_address` varchar(255) DEFAULT NULL,
  `el_mobilephone` varchar(255) DEFAULT NULL,
  `el_link_website` varchar(255) DEFAULT NULL,
  `el_link_facebook` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_banners_categories`
--

CREATE TABLE `fs_banners_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `price` double DEFAULT 0,
  `summary` text DEFAULT NULL,
  `days` int(11) DEFAULT 0,
  `is_types` tinyint(4) DEFAULT 0,
  `is_service` tinyint(4) DEFAULT 0,
  `width` int(11) DEFAULT 0,
  `height` int(11) DEFAULT 0,
  `quantity` int(11) DEFAULT 0,
  `check_unlimit` tinyint(4) DEFAULT 0,
  `quantity_use` int(11) DEFAULT 0,
  `link_post` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_banners_categories_en`
--

CREATE TABLE `fs_banners_categories_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `price` double DEFAULT 0,
  `summary` text DEFAULT NULL,
  `days` int(11) DEFAULT 0,
  `is_types` tinyint(4) DEFAULT 0,
  `is_service` tinyint(4) DEFAULT 0,
  `width` int(11) DEFAULT 0,
  `height` int(11) DEFAULT 0,
  `quantity` int(11) DEFAULT 0,
  `check_unlimit` tinyint(4) DEFAULT 0,
  `quantity_use` int(11) DEFAULT 0,
  `link_post` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_banners_en`
--

CREATE TABLE `fs_banners_en` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` int(4) DEFAULT NULL COMMENT '0: images/flash; 1: content',
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `flash` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `width` int(11) NOT NULL DEFAULT 0,
  `height` int(11) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `news_categories` varchar(255) DEFAULT NULL,
  `news_categories_alias` varchar(255) DEFAULT NULL,
  `products_categories` varchar(255) DEFAULT NULL,
  `products_categories_alias` varchar(255) DEFAULT NULL,
  `listItemid` varchar(255) DEFAULT NULL,
  `contents_categories` varchar(255) DEFAULT NULL,
  `contents_categories_alias` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `order_id` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT 0,
  `order_id_item` int(11) DEFAULT 0,
  `total_usage` int(11) DEFAULT 0,
  `days` int(11) DEFAULT 0,
  `is_use` tinyint(4) DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `check_link` int(11) DEFAULT 1,
  `is_types` tinyint(4) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  `user_admin_name` varchar(255) DEFAULT NULL,
  `link_video` varchar(255) DEFAULT NULL,
  `user_admin` int(11) DEFAULT 0,
  `el_user_name` varchar(255) DEFAULT NULL,
  `el_info` text DEFAULT NULL,
  `el_address` varchar(255) DEFAULT NULL,
  `el_mobilephone` varchar(255) DEFAULT NULL,
  `el_link_website` varchar(255) DEFAULT NULL,
  `el_link_facebook` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_banners_en_`
--

CREATE TABLE `fs_banners_en_` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `type` int(4) DEFAULT NULL COMMENT '0: images/flash; 1: content',
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `flash` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `width` int(11) NOT NULL DEFAULT 0,
  `height` int(11) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `news_categories` varchar(255) DEFAULT NULL,
  `news_categories_alias` varchar(255) DEFAULT NULL,
  `products_categories` varchar(255) DEFAULT NULL,
  `products_categories_alias` varchar(255) DEFAULT NULL,
  `listItemid` varchar(255) DEFAULT NULL,
  `contents_categories` varchar(255) DEFAULT NULL,
  `contents_categories_alias` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `order_id` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT 0,
  `order_id_item` int(11) DEFAULT 0,
  `total_usage` int(11) DEFAULT 0,
  `days` int(11) DEFAULT 0,
  `is_use` tinyint(4) DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `check_link` int(11) DEFAULT 1,
  `is_types` tinyint(4) DEFAULT 0,
  `status` int(11) DEFAULT 1,
  `user_admin_name` varchar(255) DEFAULT NULL,
  `link_video` varchar(255) DEFAULT NULL,
  `user_admin` int(11) DEFAULT 0,
  `el_user_name` varchar(255) DEFAULT NULL,
  `el_info` text DEFAULT NULL,
  `el_address` varchar(255) DEFAULT NULL,
  `el_mobilephone` varchar(255) DEFAULT NULL,
  `el_link_website` varchar(255) DEFAULT NULL,
  `el_link_facebook` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_blocks`
--

CREATE TABLE `fs_blocks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `position` varchar(250) DEFAULT NULL,
  `listItemid` varchar(255) DEFAULT NULL,
  `params` text DEFAULT NULL,
  `showTitle` tinyint(4) DEFAULT NULL,
  `hide_admin` tinyint(4) DEFAULT NULL,
  `news_categories` text DEFAULT NULL,
  `contents_categories` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `contents_categories_alias` varchar(255) DEFAULT NULL,
  `text_replace` varchar(255) DEFAULT NULL,
  `text_color` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `module_id` int(11) DEFAULT 0,
  `module_name` varchar(255) DEFAULT NULL,
  `type_html` varchar(255) DEFAULT NULL,
  `background_color` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `type_background` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_blocks_en`
--

CREATE TABLE `fs_blocks_en` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `position` varchar(250) DEFAULT NULL,
  `listItemid` varchar(255) DEFAULT NULL,
  `params` text DEFAULT NULL,
  `showTitle` tinyint(4) DEFAULT NULL,
  `hide_admin` tinyint(4) DEFAULT NULL,
  `news_categories` text DEFAULT NULL,
  `contents_categories` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `contents_categories_alias` varchar(255) DEFAULT NULL,
  `text_replace` varchar(255) DEFAULT NULL,
  `text_color` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `module_id` int(11) DEFAULT 0,
  `module_name` varchar(255) DEFAULT NULL,
  `type_html` varchar(255) DEFAULT NULL,
  `background_color` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `type_background` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_blocks_exist`
--

CREATE TABLE `fs_blocks_exist` (
  `id` int(11) NOT NULL,
  `block` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `price` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_business`
--

CREATE TABLE `fs_business` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `tablenames` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `first_toll` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `seo_keyword` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `seo_description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `prefix_name` varchar(255) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0,
  `phone` varchar(225) DEFAULT NULL,
  `Skype` varchar(255) DEFAULT NULL,
  `Zalo` varchar(255) DEFAULT NULL,
  `khuvuc` varchar(255) DEFAULT NULL,
  `khuvuc_name` varchar(255) DEFAULT '',
  `products` varchar(255) DEFAULT NULL,
  `lienhe` text DEFAULT NULL,
  `lienhe_kd` text DEFAULT NULL,
  `lienhe_kt` text DEFAULT NULL,
  `lienhe_kdmb` text DEFAULT NULL,
  `lienhe_kdmn` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_business_en`
--

CREATE TABLE `fs_business_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `tablenames` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `first_toll` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `seo_keyword` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `seo_description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `prefix_name` varchar(255) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0,
  `phone` varchar(225) DEFAULT NULL,
  `Skype` varchar(255) DEFAULT NULL,
  `Zalo` varchar(255) DEFAULT NULL,
  `khuvuc` varchar(255) DEFAULT NULL,
  `khuvuc_name` varchar(255) DEFAULT '',
  `products` varchar(255) DEFAULT NULL,
  `lienhe` text DEFAULT NULL,
  `lienhe_kd` text DEFAULT NULL,
  `lienhe_kt` text DEFAULT NULL,
  `lienhe_kdmb` text DEFAULT NULL,
  `lienhe_kdmn` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_cities`
--

CREATE TABLE `fs_cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `area_id` int(11) DEFAULT NULL,
  `area_name` varchar(255) DEFAULT NULL,
  `area_alias` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `is_hot` tinyint(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_cities_en`
--

CREATE TABLE `fs_cities_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `area_id` int(11) DEFAULT NULL,
  `area_name` varchar(255) DEFAULT NULL,
  `area_alias` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `is_hot` tinyint(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_config`
--

CREATE TABLE `fs_config` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `data_type` varchar(50) DEFAULT 'text',
  `is_common` tinyint(1) NOT NULL DEFAULT 1,
  `published` tinyint(4) DEFAULT NULL COMMENT 'thông số giành cho google',
  `is_ga` tinyint(4) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_config_en`
--

CREATE TABLE `fs_config_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `data_type` varchar(50) DEFAULT 'text',
  `is_common` tinyint(1) NOT NULL DEFAULT 1,
  `published` tinyint(4) DEFAULT NULL COMMENT 'thông số giành cho google',
  `is_ga` tinyint(4) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_config_enjicad`
--

CREATE TABLE `fs_config_enjicad` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `data_type` varchar(50) DEFAULT 'text',
  `is_common` tinyint(1) NOT NULL DEFAULT 1,
  `published` tinyint(4) DEFAULT NULL COMMENT 'thông số giành cho google',
  `is_ga` tinyint(4) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_config_modules`
--

CREATE TABLE `fs_config_modules` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL COMMENT 'Tên module hoặc type',
  `view` varchar(255) DEFAULT NULL,
  `task` varchar(255) DEFAULT NULL COMMENT 'Mặc định là display',
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` varchar(255) DEFAULT NULL,
  `cache` int(11) DEFAULT NULL,
  `params` text DEFAULT NULL,
  `fields_seo_title` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_keyword` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_description` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_h1` varchar(255) DEFAULT NULL,
  `fields_seo_h2` varchar(255) DEFAULT NULL,
  `fields_seo_image_alt` varchar(255) DEFAULT NULL,
  `value_seo_title` varchar(255) DEFAULT NULL COMMENT 'Thông số này giúp cho các trang không nhập được  SEO như trang "trang chủ sp, trang chủ tin tức,...)',
  `value_seo_keyword` varchar(255) DEFAULT NULL,
  `value_seo_description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_config_modules_en`
--

CREATE TABLE `fs_config_modules_en` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL COMMENT 'Tên module hoặc type',
  `view` varchar(255) DEFAULT NULL,
  `task` varchar(255) DEFAULT NULL COMMENT 'Mặc định là display',
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` varchar(255) DEFAULT NULL,
  `cache` int(11) DEFAULT NULL,
  `params` text DEFAULT NULL,
  `fields_seo_title` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_keyword` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_description` varchar(255) DEFAULT NULL COMMENT 'số 1 đứng đằng trước trường tức là "AND" là luôn cộng vào\r\nsố 0 đứng đằng trước trường là "OR" là có tham số trước nó rồi thì sau sẽ ko cộng thêm vào nữa',
  `fields_seo_h1` varchar(255) DEFAULT NULL,
  `fields_seo_h2` varchar(255) DEFAULT NULL,
  `fields_seo_image_alt` varchar(255) DEFAULT NULL,
  `value_seo_title` varchar(255) DEFAULT NULL COMMENT 'Thông số này giúp cho các trang không nhập được  SEO như trang "trang chủ sp, trang chủ tin tức,...)',
  `value_seo_keyword` varchar(255) DEFAULT NULL,
  `value_seo_description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contact`
--

CREATE TABLE `fs_contact` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `type_id` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `edited_time` datetime NOT NULL,
  `created_time` datetime NOT NULL,
  `published` tinyint(4) NOT NULL,
  `parts_email` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contact_en`
--

CREATE TABLE `fs_contact_en` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `type_id` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `edited_time` datetime NOT NULL,
  `created_time` datetime NOT NULL,
  `published` tinyint(4) NOT NULL,
  `parts_email` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contact_enjicad`
--

CREATE TABLE `fs_contact_enjicad` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `type_id` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `edited_time` datetime NOT NULL,
  `created_time` datetime NOT NULL,
  `published` tinyint(4) NOT NULL,
  `parts_email` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contents`
--

CREATE TABLE `fs_contents` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `hits` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `show_map` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contents_categories`
--

CREATE TABLE `fs_contents_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `old_path` varchar(255) DEFAULT NULL,
  `old_name` varchar(255) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(4) NOT NULL DEFAULT 1,
  `estore_id` int(11) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_tags` tinyint(4) NOT NULL DEFAULT 1,
  `display_related` tinyint(4) NOT NULL DEFAULT 1,
  `display_created_time` tinyint(4) NOT NULL DEFAULT 1,
  `display_category` tinyint(4) NOT NULL DEFAULT 1,
  `display_comment` tinyint(4) NOT NULL DEFAULT 1,
  `display_sharing` tinyint(4) NOT NULL DEFAULT 1,
  `name_display` varchar(255) DEFAULT NULL,
  `is_comment` tinyint(4) NOT NULL DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contents_categories_en`
--

CREATE TABLE `fs_contents_categories_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `old_path` varchar(255) DEFAULT NULL,
  `old_name` varchar(255) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(4) NOT NULL DEFAULT 1,
  `estore_id` int(11) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_tags` tinyint(4) NOT NULL DEFAULT 1,
  `display_related` tinyint(4) NOT NULL DEFAULT 1,
  `display_created_time` tinyint(4) NOT NULL DEFAULT 1,
  `display_category` tinyint(4) NOT NULL DEFAULT 1,
  `display_comment` tinyint(4) NOT NULL DEFAULT 1,
  `display_sharing` tinyint(4) NOT NULL DEFAULT 1,
  `name_display` varchar(255) DEFAULT NULL,
  `is_comment` tinyint(4) NOT NULL DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contents_en`
--

CREATE TABLE `fs_contents_en` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `hits` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `show_map` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_contents_en-bk`
--

CREATE TABLE `fs_contents_en-bk` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `hits` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `show_map` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_email`
--

CREATE TABLE `fs_email` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0,
  `products` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `types` int(25) DEFAULT NULL,
  `lienhe_kd` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kt` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kdmb` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kdmn` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_email_en`
--

CREATE TABLE `fs_email_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0,
  `products` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `types` int(25) DEFAULT NULL,
  `lienhe_kd` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kt` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kdmb` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lienhe_kdmn` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_event`
--

CREATE TABLE `fs_event` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` longtext DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `place` varchar(255) DEFAULT NULL,
  `event_related` varchar(255) DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `time_event` datetime DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `link_dangky` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `specific_time` varchar(255) DEFAULT NULL,
  `chu_de` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) DEFAULT NULL,
  `tawk_to` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_event_en`
--

CREATE TABLE `fs_event_en` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` longtext DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `place` varchar(255) DEFAULT NULL,
  `event_related` varchar(255) DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `time_event` datetime DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `link_dangky` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `specific_time` varchar(255) DEFAULT NULL,
  `chu_de` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) DEFAULT NULL,
  `tawk_to` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_extends_groups`
--

CREATE TABLE `fs_extends_groups` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(250) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_extends_items`
--

CREATE TABLE `fs_extends_items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_history`
--

CREATE TABLE `fs_history` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `money` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'buy' COMMENT 'buy: mua , sale: bán sp, add: nạp tiền',
  `description` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_hits`
--

CREATE TABLE `fs_hits` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(250) NOT NULL,
  `visited_time` datetime DEFAULT NULL,
  `page` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image`
--

CREATE TABLE `fs_image` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image_en`
--

CREATE TABLE `fs_image_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image_en_`
--

CREATE TABLE `fs_image_en_` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) NOT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) NOT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image_images`
--

CREATE TABLE `fs_image_images` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image_images_en`
--

CREATE TABLE `fs_image_images_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_image_images_en_`
--

CREATE TABLE `fs_image_images_en_` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) NOT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` int(50) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `manufactory_image` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `model_alias` varchar(255) DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `tablename` varchar(100) DEFAULT NULL,
  `price` double(11,0) DEFAULT 0,
  `price_old` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `sale_count` int(11) DEFAULT 0,
  `keyword` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `favourite` int(11) NOT NULL DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) NOT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `comments_total` int(11) NOT NULL DEFAULT 0,
  `comments_unread` int(11) NOT NULL DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) NOT NULL DEFAULT 0,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `district_alias` varchar(255) DEFAULT NULL,
  `district_name` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` text DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_keywords`
--

CREATE TABLE `fs_keywords` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `is_home` tinyint(4) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_khuvuc`
--

CREATE TABLE `fs_khuvuc` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_khuvuc_en`
--

CREATE TABLE `fs_khuvuc_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_languages`
--

CREATE TABLE `fs_languages` (
  `id` int(11) NOT NULL,
  `language` varchar(255) DEFAULT NULL,
  `lang_sort` varchar(255) DEFAULT NULL,
  `is_default` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_languages_contents`
--

CREATE TABLE `fs_languages_contents` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `value` longtext DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_languages_tables`
--

CREATE TABLE `fs_languages_tables` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `main_field_display` varchar(255) DEFAULT NULL COMMENT 'field to display main when show records',
  `edited_time` datetime DEFAULT NULL,
  `published` int(11) NOT NULL DEFAULT 1,
  `field_not_display` text DEFAULT NULL COMMENT 'các trường ko hiển thị',
  `field_synchronize` text DEFAULT NULL COMMENT 'Các trường luôn phải lấy theo trang gốc, ko thay đổi theo ngôn ngữ',
  `field_inner_change_simultaneously` varchar(255) DEFAULT NULL COMMENT 'Những trường (ẩn) trong bảng tự động thay đổi theo, thay đổi cùng lúc save',
  `field_inner_change_after` varchar(255) DEFAULT NULL COMMENT 'Những trường (ẩn) trong bảng tự động thay đổi theo, thay đổi sau khi lưu record',
  `field_outer_change` varchar(255) DEFAULT NULL COMMENT 'những trường ngoài bảng tự động thay đổi theo\r\nfield_outer_change => field_inner_from|table_outer|function|field_compare_inner|field_compare_outer',
  `where` varchar(255) DEFAULT NULL COMMENT 'Thêm điều kiện hiển thị dịch',
  `functions` varchar(255) DEFAULT NULL COMMENT 'Hàm hỗ trợ: (function => field|function1 => field1)',
  `ordering` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_languages_text`
--

CREATE TABLE `fs_languages_text` (
  `id` int(11) NOT NULL,
  `lang_key` varchar(255) NOT NULL,
  `lang_vi` varchar(255) DEFAULT NULL,
  `lang_en` varchar(255) DEFAULT NULL,
  `lang_fr` varchar(255) DEFAULT NULL,
  `is_common` tinyint(4) NOT NULL DEFAULT 1,
  `module` varchar(100) DEFAULT NULL,
  `admin_change` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_languages_text_admin`
--

CREATE TABLE `fs_languages_text_admin` (
  `id` int(11) NOT NULL,
  `lang_key` varchar(255) NOT NULL,
  `lang_vi` varchar(255) DEFAULT NULL,
  `lang_en` varchar(255) DEFAULT NULL,
  `lang_fr` varchar(255) DEFAULT NULL,
  `is_common` tinyint(4) NOT NULL DEFAULT 1,
  `module` varchar(100) DEFAULT NULL,
  `admin_change` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_manufactories`
--

CREATE TABLE `fs_manufactories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_manufactories_en`
--

CREATE TABLE `fs_manufactories_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_manufactories_en_bk`
--

CREATE TABLE `fs_manufactories_en_bk` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_members`
--

CREATE TABLE `fs_members` (
  `id` int(11) NOT NULL,
  `estore_id` int(11) NOT NULL DEFAULT 0,
  `username` varchar(255) NOT NULL,
  `password` varchar(200) NOT NULL,
  `full_name` varchar(50) DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `sex` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `address` varchar(4000) DEFAULT NULL,
  `district_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `published_time` datetime DEFAULT NULL,
  `published` tinyint(1) NOT NULL,
  `block` tinyint(1) NOT NULL DEFAULT 0,
  `telephone` varchar(30) DEFAULT NULL,
  `mobilephone` varchar(30) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `email` varchar(255) NOT NULL,
  `edited_time` datetime DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `job` varchar(255) DEFAULT NULL,
  `activated_code` varchar(255) DEFAULT NULL,
  `is_newsletter` tinyint(4) NOT NULL DEFAULT 0,
  `published_info` tinyint(4) NOT NULL DEFAULT 0,
  `point` int(11) NOT NULL DEFAULT 0,
  `money` double(255,0) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `message` varchar(300) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_admin`
--

CREATE TABLE `fs_menus_admin` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) NOT NULL DEFAULT 1,
  `admin_type` tinyint(4) DEFAULT NULL COMMENT 'to used for Admin or User in back-end',
  `module` varchar(255) DEFAULT NULL,
  `featured` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT 'fa fa-star',
  `view` varchar(255) DEFAULT NULL,
  `code_color` int(11) DEFAULT 1,
  `count` varchar(255) DEFAULT NULL,
  `where` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_createlink`
--

CREATE TABLE `fs_menus_createlink` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) NOT NULL DEFAULT '0',
  `link_menu` varchar(255) DEFAULT NULL,
  `add_parameter` varchar(255) DEFAULT NULL,
  `add_table` varchar(255) DEFAULT NULL,
  `add_field_display` varchar(255) DEFAULT NULL COMMENT 'component of module',
  `add_field_value` varchar(255) DEFAULT NULL,
  `add_field_distinct` tinyint(4) DEFAULT NULL,
  `params` varchar(255) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) UNSIGNED NOT NULL DEFAULT 1,
  `is_article` tinyint(4) DEFAULT NULL,
  `is_type` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_groups`
--

CREATE TABLE `fs_menus_groups` (
  `id` int(11) NOT NULL,
  `group_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `actflg` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'A',
  `ctdusr` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ctdwks` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mdfwks` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mdfpgm` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_groups_en`
--

CREATE TABLE `fs_menus_groups_en` (
  `id` int(11) NOT NULL,
  `group_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `actflg` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'A',
  `ctdusr` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ctdwks` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mdfwks` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `mdfpgm` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_items`
--

CREATE TABLE `fs_menus_items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `show_admin` tinyint(4) NOT NULL DEFAULT 1,
  `alias` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `target` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 1,
  `default` tinyint(4) DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `list_parent` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `is_rewrite` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_en` tinyint(4) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `description_short` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `is_type` tinyint(4) DEFAULT 0,
  `summary` text DEFAULT NULL,
  `is_link` tinyint(4) DEFAULT 0,
  `bk_color` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_items_en`
--

CREATE TABLE `fs_menus_items_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `show_admin` tinyint(4) NOT NULL DEFAULT 1,
  `alias` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `target` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 1,
  `default` tinyint(4) DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `list_parent` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `is_rewrite` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_en` tinyint(4) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `description_short` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `is_type` tinyint(4) DEFAULT 0,
  `summary` text DEFAULT NULL,
  `is_link` tinyint(4) DEFAULT 0,
  `bk_color` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_menus_items_en_bk`
--

CREATE TABLE `fs_menus_items_en_bk` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `show_admin` tinyint(4) NOT NULL DEFAULT 1,
  `alias` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `target` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 1,
  `default` tinyint(4) DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `list_parent` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `is_rewrite` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_en` tinyint(4) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `description_short` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `is_type` tinyint(4) DEFAULT 0,
  `summary` text DEFAULT NULL,
  `is_link` tinyint(4) DEFAULT 0,
  `bk_color` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news`
--

CREATE TABLE `fs_news` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `is_slide` tinyint(4) DEFAULT 0,
  `is_new_video` tinyint(4) DEFAULT 0,
  `is_video` tinyint(4) DEFAULT 0,
  `hits` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` longtext DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `comments_total` int(11) DEFAULT 0,
  `comments_unread` int(11) DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) DEFAULT 0,
  `products_related` varchar(255) DEFAULT NULL,
  `action_time` datetime DEFAULT NULL,
  `action_username` varchar(255) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL,
  `action_name` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `source_news` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `file_upload` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_18052020`
--

CREATE TABLE `fs_news_18052020` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `is_slide` tinyint(4) DEFAULT 0,
  `is_new_video` tinyint(4) DEFAULT 0,
  `is_video` tinyint(4) DEFAULT 0,
  `hits` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` longtext DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `comments_total` int(11) DEFAULT 0,
  `comments_unread` int(11) DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) DEFAULT 0,
  `products_related` varchar(255) DEFAULT NULL,
  `action_time` datetime DEFAULT NULL,
  `action_username` varchar(255) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL,
  `action_name` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `source_news` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `file_upload` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_categories`
--

CREATE TABLE `fs_news_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(4) NOT NULL DEFAULT 1,
  `estore_id` int(11) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_tags` tinyint(4) NOT NULL DEFAULT 1,
  `display_related` tinyint(4) NOT NULL DEFAULT 1,
  `display_created_time` tinyint(4) NOT NULL DEFAULT 1,
  `display_category` tinyint(4) NOT NULL DEFAULT 1,
  `display_comment` tinyint(4) NOT NULL DEFAULT 1,
  `display_sharing` tinyint(4) NOT NULL DEFAULT 1,
  `name_display` varchar(255) DEFAULT NULL,
  `is_comment` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `display_summary` tinyint(4) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `icon_font` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_categories_copy1`
--

CREATE TABLE `fs_news_categories_copy1` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(4) NOT NULL DEFAULT 1,
  `estore_id` int(11) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_tags` tinyint(4) NOT NULL DEFAULT 1,
  `display_related` tinyint(4) NOT NULL DEFAULT 1,
  `display_created_time` tinyint(4) NOT NULL DEFAULT 1,
  `display_category` tinyint(4) NOT NULL DEFAULT 1,
  `display_comment` tinyint(4) NOT NULL DEFAULT 1,
  `display_sharing` tinyint(4) NOT NULL DEFAULT 1,
  `name_display` varchar(255) DEFAULT NULL,
  `is_comment` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `display_summary` tinyint(4) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `icon_font` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_categories_en`
--

CREATE TABLE `fs_news_categories_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(4) NOT NULL DEFAULT 1,
  `estore_id` int(11) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_tags` tinyint(4) NOT NULL DEFAULT 1,
  `display_related` tinyint(4) NOT NULL DEFAULT 1,
  `display_created_time` tinyint(4) NOT NULL DEFAULT 1,
  `display_category` tinyint(4) NOT NULL DEFAULT 1,
  `display_comment` tinyint(4) NOT NULL DEFAULT 1,
  `display_sharing` tinyint(4) NOT NULL DEFAULT 1,
  `name_display` varchar(255) DEFAULT NULL,
  `is_comment` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `display_summary` tinyint(4) DEFAULT NULL,
  `products_related` varchar(255) DEFAULT NULL,
  `icon_font` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_en`
--

CREATE TABLE `fs_news_en` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `is_slide` tinyint(4) DEFAULT 0,
  `is_new_video` tinyint(4) DEFAULT 0,
  `is_video` tinyint(4) DEFAULT 0,
  `hits` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `comments_total` int(11) DEFAULT 0,
  `comments_unread` int(11) DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) DEFAULT 0,
  `products_related` varchar(255) DEFAULT NULL,
  `action_time` datetime DEFAULT NULL,
  `action_username` varchar(255) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL,
  `action_name` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `source_news` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `file_upload` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_en1`
--

CREATE TABLE `fs_news_en1` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT 0,
  `is_slide` tinyint(4) DEFAULT 0,
  `is_new_video` tinyint(4) DEFAULT 0,
  `is_video` tinyint(4) DEFAULT 0,
  `hits` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) NOT NULL DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `is_new` tinyint(4) DEFAULT 0,
  `is_hot` tinyint(4) DEFAULT 0,
  `comments_total` int(11) DEFAULT 0,
  `comments_unread` int(11) DEFAULT 0,
  `comments_last_time` datetime DEFAULT NULL,
  `comments_published` int(11) DEFAULT 0,
  `products_related` varchar(255) DEFAULT NULL,
  `action_time` datetime DEFAULT NULL,
  `action_username` varchar(255) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL,
  `action_name` varchar(255) DEFAULT NULL,
  `news_related` varchar(255) DEFAULT NULL,
  `source_news` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `optimal_seo` tinyint(4) DEFAULT 0,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_news_keyword`
--

CREATE TABLE `fs_news_keyword` (
  `id` int(11) NOT NULL,
  `new_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name_replace` varchar(255) DEFAULT NULL,
  `link_replace` text DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  `type_link` int(11) DEFAULT 0,
  `new_title` varchar(255) DEFAULT NULL,
  `new_image` varchar(500) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_onlinesupport`
--

CREATE TABLE `fs_onlinesupport` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  `yahoo` varchar(255) DEFAULT NULL,
  `skype` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hotline` varchar(255) DEFAULT NULL,
  `published` tinyint(1) NOT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_estonian_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_order`
--

CREATE TABLE `fs_order` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user_id` int(255) DEFAULT NULL,
  `products_id` varchar(100) DEFAULT NULL,
  `buy_direct` int(11) DEFAULT 1 COMMENT '1: direct, 0: indirect',
  `is_temporary` tinyint(4) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `sender_sex` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sender_address` varchar(100) DEFAULT NULL,
  `sender_email` varchar(50) DEFAULT NULL,
  `sender_telephone` varchar(50) DEFAULT NULL,
  `sender_comments` text DEFAULT NULL,
  `recipients_name` varchar(100) NOT NULL DEFAULT '',
  `recipients_sex` varchar(50) DEFAULT NULL,
  `recipients_address` varchar(100) DEFAULT NULL,
  `recipients_email` varchar(50) DEFAULT NULL,
  `recipients_telephone` varchar(50) DEFAULT NULL,
  `recipients_mobile` varchar(50) DEFAULT NULL,
  `recipients_comments` text CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `recipients_here` tinyint(4) DEFAULT NULL COMMENT '1: Nhận tại cửa hàng\r\n0: Nhận tại địa chỉ người nhận',
  `received_time` datetime DEFAULT NULL,
  `payment_method` int(11) DEFAULT NULL COMMENT '0: direct\r\n1: indirect by address',
  `transfer_method` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `is_activated` int(11) DEFAULT NULL,
  `total_before_discount` double DEFAULT NULL,
  `total_after_discount` double DEFAULT NULL COMMENT 'Chỉ tính sau khi giảm 2 loại khuyến mại, và bán kèm. Chưa tính giảm cho hạng thành viên',
  `total_end` double DEFAULT NULL COMMENT 'Giảm giá tất cả',
  `member_level` int(11) DEFAULT NULL COMMENT 'Hạng thành viên',
  `member_discount` varchar(11) DEFAULT NULL COMMENT 'Giảm giá hạng thành viên',
  `products_count` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `code_order` varchar(50) DEFAULT NULL,
  `no_people` int(11) NOT NULL DEFAULT 0,
  `is_cancel` tinyint(4) NOT NULL,
  `cancel_people` varchar(255) NOT NULL,
  `cancel_time` datetime NOT NULL,
  `cancel_is_penalty` tinyint(255) NOT NULL,
  `cancel_money_penalty` varchar(255) NOT NULL,
  `cancel_username_penalty` varchar(255) NOT NULL,
  `cancel_is_compensation` tinyint(4) NOT NULL,
  `cancel_money_compensation` varchar(255) NOT NULL,
  `cancel_username_compensation` varchar(255) NOT NULL,
  `status_before_cancel` int(11) DEFAULT NULL,
  `is_dispute` tinyint(4) DEFAULT NULL COMMENT 'Nếu xảy ra tranh chấp ( cho status > 1)',
  `status_order` tinyint(2) DEFAULT 2,
  `payment_message` varchar(255) DEFAULT NULL,
  `discount_id` varchar(255) DEFAULT NULL,
  `discount_value` varchar(255) DEFAULT NULL,
  `discount_unit` tinyint(4) DEFAULT NULL,
  `discount_money` varchar(255) DEFAULT NULL,
  `discount_code` varchar(255) DEFAULT NULL,
  `ord_payment_type` int(11) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_order_items`
--

CREATE TABLE `fs_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `estore_id` int(11) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `discount` double DEFAULT NULL COMMENT 'giảm giá thông thường/(%/1sp)',
  `discount_incentives` double DEFAULT NULL COMMENT 'giảm giá khi mua kèm/(%/1sp)',
  `total` double DEFAULT NULL COMMENT 'not discount',
  `total_after_discount` double DEFAULT NULL COMMENT 'giá sau khi giảm giá cả hai loại',
  `status` int(11) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=FIXED;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_permission_field`
--

CREATE TABLE `fs_permission_field` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `field` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT 1,
  `module` varchar(255) DEFAULT NULL,
  `view` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_permission_fun`
--

CREATE TABLE `fs_permission_fun` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `field` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_permission_tasks`
--

CREATE TABLE `fs_permission_tasks` (
  `id` int(11) NOT NULL,
  `module` varchar(255) DEFAULT NULL,
  `view` varchar(255) DEFAULT NULL,
  `_task` varchar(255) NOT NULL DEFAULT '1',
  `trigger` varchar(255) DEFAULT NULL COMMENT 'Task này sẽ gọi phân quyền của 1 task tương tự',
  `description` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `list_field` text DEFAULT NULL,
  `list_function` text DEFAULT NULL,
  `is_contents` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products`
--

CREATE TABLE `fs_products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` varchar(255) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT '0',
  `price_old` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` longtext DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `file_full` varchar(255) DEFAULT NULL,
  `file_price` varchar(255) DEFAULT NULL,
  `file_driver` varchar(255) DEFAULT NULL,
  `file_demo` varchar(255) DEFAULT NULL,
  `name_captain` varchar(255) DEFAULT NULL,
  `types_id` varchar(255) DEFAULT NULL,
  `products_relates` varchar(255) DEFAULT NULL,
  `
sub_name` varchar(255) DEFAULT NULL,
  `email_contact` varchar(255) DEFAULT NULL,
  `email_download` varchar(255) DEFAULT NULL,
  `email_order` varchar(255) DEFAULT NULL,
  `email_driver` varchar(255) DEFAULT NULL,
  `email_catalogue` varchar(255) DEFAULT NULL,
  `file_name1` varchar(255) DEFAULT NULL,
  `file_download1` varchar(255) DEFAULT NULL,
  `link_download1` varchar(255) DEFAULT NULL,
  `file_name2` varchar(255) DEFAULT NULL,
  `file_download2` varchar(255) DEFAULT NULL,
  `link_download2` varchar(255) DEFAULT NULL,
  `file_name3` varchar(255) DEFAULT NULL,
  `file_download3` varchar(255) DEFAULT NULL,
  `link_download3` varchar(255) DEFAULT NULL,
  `file_name4` varchar(255) DEFAULT NULL,
  `file_download4` varchar(255) DEFAULT NULL,
  `link_download4` varchar(255) DEFAULT NULL,
  `file_name5` varchar(255) DEFAULT NULL,
  `file_download5` varchar(255) DEFAULT NULL,
  `link_download5` varchar(255) DEFAULT NULL,
  `file_name6` varchar(255) DEFAULT NULL,
  `file_download6` varchar(255) DEFAULT NULL,
  `link_download6` varchar(255) DEFAULT NULL,
  `link_driver` varchar(255) DEFAULT NULL,
  `file_catalogue` varchar(255) DEFAULT NULL,
  `link_catalogue` varchar(255) DEFAULT NULL,
  `file_driver_name` varchar(255) DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `comments_published` int(11) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `style_mail` int(11) DEFAULT NULL,
  `hit1` int(11) DEFAULT NULL,
  `hit2` int(11) DEFAULT NULL,
  `hit3` int(11) DEFAULT NULL,
  `hit4` int(11) DEFAULT NULL,
  `hit5` int(11) DEFAULT NULL,
  `hit6` int(11) DEFAULT NULL,
  `types_alias` varchar(255) DEFAULT NULL,
  `application_alias` varchar(255) DEFAULT NULL,
  `teamview` tinyint(4) NOT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` longtext DEFAULT NULL,
  `landing_page` varchar(255) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL,
  `
other_languages` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_categories`
--

CREATE TABLE `fs_products_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `level` int(10) UNSIGNED DEFAULT 0,
  `parent_id` int(10) DEFAULT 0,
  `alias` varchar(250) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(2) DEFAULT 0,
  `show_in_footer` tinyint(2) DEFAULT 1,
  `root_id` int(11) DEFAULT NULL,
  `root_alias` varchar(100) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `tags_group` varchar(255) DEFAULT NULL,
  `total_products` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `vat` int(11) NOT NULL DEFAULT 0,
  `is_accessories` tinyint(4) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `promotion_main` text DEFAULT NULL,
  `hotline` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `published_image` tinyint(4) DEFAULT NULL,
  `promotion` text DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `sizes` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_categories_en`
--

CREATE TABLE `fs_products_categories_en` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `level` int(10) UNSIGNED DEFAULT 0,
  `parent_id` int(10) DEFAULT 0,
  `alias` varchar(250) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `image` varchar(250) DEFAULT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `ordering` int(11) DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `show_in_homepage` tinyint(2) DEFAULT 0,
  `show_in_footer` tinyint(2) DEFAULT 1,
  `root_id` int(11) DEFAULT NULL,
  `root_alias` varchar(100) DEFAULT NULL,
  `list_parents` varchar(255) DEFAULT NULL,
  `alias_wrapper` varchar(255) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `tags_group` varchar(255) DEFAULT NULL,
  `total_products` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `vat` int(11) NOT NULL DEFAULT 0,
  `is_accessories` tinyint(4) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `promotion_main` text DEFAULT NULL,
  `hotline` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `published_image` tinyint(4) DEFAULT NULL,
  `promotion` text DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `sizes` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_copy1`
--

CREATE TABLE `fs_products_copy1` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) NOT NULL,
  `summary` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` varchar(255) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT '0',
  `price_old` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` longtext DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `file_full` varchar(255) DEFAULT NULL,
  `file_price` varchar(255) DEFAULT NULL,
  `file_driver` varchar(255) DEFAULT NULL,
  `file_demo` varchar(255) DEFAULT NULL,
  `name_captain` varchar(255) DEFAULT NULL,
  `types_id` varchar(255) DEFAULT NULL,
  `products_relates` varchar(255) DEFAULT NULL,
  `
sub_name` varchar(255) DEFAULT NULL,
  `email_contact` varchar(255) DEFAULT NULL,
  `email_download` varchar(255) DEFAULT NULL,
  `email_order` varchar(255) DEFAULT NULL,
  `email_driver` varchar(255) DEFAULT NULL,
  `email_catalogue` varchar(255) DEFAULT NULL,
  `file_name1` varchar(255) DEFAULT NULL,
  `file_download1` varchar(255) DEFAULT NULL,
  `link_download1` varchar(255) DEFAULT NULL,
  `file_name2` varchar(255) DEFAULT NULL,
  `file_download2` varchar(255) DEFAULT NULL,
  `link_download2` varchar(255) DEFAULT NULL,
  `file_name3` varchar(255) DEFAULT NULL,
  `file_download3` varchar(255) DEFAULT NULL,
  `link_download3` varchar(255) DEFAULT NULL,
  `file_name4` varchar(255) DEFAULT NULL,
  `file_download4` varchar(255) DEFAULT NULL,
  `link_download4` varchar(255) DEFAULT NULL,
  `file_name5` varchar(255) DEFAULT NULL,
  `file_download5` varchar(255) DEFAULT NULL,
  `link_download5` varchar(255) DEFAULT NULL,
  `file_name6` varchar(255) DEFAULT NULL,
  `file_download6` varchar(255) DEFAULT NULL,
  `link_download6` varchar(255) DEFAULT NULL,
  `link_driver` varchar(255) DEFAULT NULL,
  `file_catalogue` varchar(255) DEFAULT NULL,
  `link_catalogue` varchar(255) DEFAULT NULL,
  `file_driver_name` varchar(255) DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `comments_published` int(11) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `style_mail` int(11) DEFAULT NULL,
  `hit1` int(11) NOT NULL,
  `hit2` int(11) NOT NULL,
  `hit3` int(11) NOT NULL,
  `hit4` int(11) NOT NULL,
  `hit5` int(11) NOT NULL,
  `hit6` int(11) NOT NULL,
  `types_alias` varchar(255) DEFAULT NULL,
  `application_alias` varchar(255) DEFAULT NULL,
  `teamview` tinyint(4) NOT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `landing_page` varchar(255) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_en`
--

CREATE TABLE `fs_products_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` varchar(255) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT '0',
  `price_old` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` longtext DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `file_full` varchar(255) DEFAULT NULL,
  `file_price` varchar(255) DEFAULT NULL,
  `file_driver` varchar(255) DEFAULT NULL,
  `file_demo` varchar(255) DEFAULT NULL,
  `name_captain` varchar(255) DEFAULT NULL,
  `types_id` varchar(255) DEFAULT NULL,
  `products_relates` varchar(255) DEFAULT NULL,
  `
sub_name` varchar(255) DEFAULT NULL,
  `email_contact` varchar(255) DEFAULT NULL,
  `email_download` varchar(255) DEFAULT NULL,
  `email_order` varchar(255) DEFAULT NULL,
  `email_driver` varchar(255) DEFAULT NULL,
  `email_catalogue` varchar(255) DEFAULT NULL,
  `file_name1` varchar(255) DEFAULT NULL,
  `file_download1` varchar(255) DEFAULT NULL,
  `link_download1` varchar(255) DEFAULT NULL,
  `file_name2` varchar(255) DEFAULT NULL,
  `file_download2` varchar(255) DEFAULT NULL,
  `link_download2` varchar(255) DEFAULT NULL,
  `file_name3` varchar(255) DEFAULT NULL,
  `file_download3` varchar(255) DEFAULT NULL,
  `link_download3` varchar(255) DEFAULT NULL,
  `file_name4` varchar(255) DEFAULT NULL,
  `file_download4` varchar(255) DEFAULT NULL,
  `link_download4` varchar(255) DEFAULT NULL,
  `file_name5` varchar(255) DEFAULT NULL,
  `file_download5` varchar(255) DEFAULT NULL,
  `link_download5` varchar(255) DEFAULT NULL,
  `file_name6` varchar(255) DEFAULT NULL,
  `file_download6` varchar(255) DEFAULT NULL,
  `link_download6` varchar(255) DEFAULT NULL,
  `link_driver` varchar(255) DEFAULT NULL,
  `file_catalogue` varchar(255) DEFAULT NULL,
  `link_catalogue` varchar(255) DEFAULT NULL,
  `file_driver_name` varchar(255) DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `comments_published` int(11) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `style_mail` int(11) DEFAULT NULL,
  `hit1` int(11) DEFAULT NULL,
  `hit2` int(11) DEFAULT NULL,
  `hit3` int(11) DEFAULT NULL,
  `hit4` int(11) DEFAULT NULL,
  `hit5` int(11) DEFAULT NULL,
  `hit6` int(11) DEFAULT NULL,
  `types_alias` varchar(255) DEFAULT NULL,
  `application_alias` varchar(255) DEFAULT NULL,
  `teamview` tinyint(4) NOT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `landing_page` varchar(255) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL,
  `
other_languages` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_en_`
--

CREATE TABLE `fs_products_en_` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_root_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` tinyint(4) NOT NULL,
  `summary` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` text DEFAULT NULL,
  `manufactory` varchar(255) DEFAULT NULL,
  `manufactory_alias` varchar(255) DEFAULT NULL,
  `manufactory_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT '0',
  `price_old` varchar(255) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `currency` varchar(50) DEFAULT 'VND',
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `tags` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `show_in_home` tinyint(4) NOT NULL DEFAULT 0,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `is_hotdeal` tinyint(4) DEFAULT NULL,
  `warranty` int(11) DEFAULT NULL,
  `is_sell` tinyint(4) NOT NULL DEFAULT 0,
  `is_hot` tinyint(4) NOT NULL DEFAULT 0,
  `rating_count` int(11) NOT NULL DEFAULT 0,
  `is_new` tinyint(4) NOT NULL DEFAULT 0,
  `size_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `user_full_name` varchar(255) DEFAULT NULL,
  `link_video` text DEFAULT NULL,
  `is_sale` tinyint(4) DEFAULT 0,
  `is_status` tinyint(4) DEFAULT 0,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT 0,
  `city_name` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT 0,
  `colors` varchar(255) DEFAULT NULL,
  `sizes` varchar(255) DEFAULT '',
  `guarantee` varchar(255) DEFAULT NULL,
  `buy_status_id` int(11) DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `feature_details` longtext DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `application_name` varchar(255) DEFAULT NULL,
  `types_name` varchar(255) DEFAULT NULL,
  `file_full` varchar(255) DEFAULT NULL,
  `file_price` varchar(255) DEFAULT NULL,
  `file_driver` varchar(255) DEFAULT NULL,
  `file_demo` varchar(255) DEFAULT NULL,
  `name_captain` varchar(255) DEFAULT NULL,
  `types_id` varchar(255) DEFAULT NULL,
  `products_relates` varchar(255) DEFAULT NULL,
  `
sub_name` varchar(255) DEFAULT NULL,
  `email_contact` varchar(255) DEFAULT NULL,
  `email_download` varchar(255) DEFAULT NULL,
  `email_order` varchar(255) DEFAULT NULL,
  `email_driver` varchar(255) DEFAULT NULL,
  `email_catalogue` varchar(255) DEFAULT NULL,
  `file_name1` varchar(255) DEFAULT NULL,
  `file_download1` varchar(255) DEFAULT NULL,
  `link_download1` varchar(255) DEFAULT NULL,
  `file_name2` varchar(255) DEFAULT NULL,
  `file_download2` varchar(255) DEFAULT NULL,
  `link_download2` varchar(255) DEFAULT NULL,
  `file_name3` varchar(255) DEFAULT NULL,
  `file_download3` varchar(255) DEFAULT NULL,
  `link_download3` varchar(255) DEFAULT NULL,
  `file_name4` varchar(255) DEFAULT NULL,
  `file_download4` varchar(255) DEFAULT NULL,
  `link_download4` varchar(255) DEFAULT NULL,
  `file_name5` varchar(255) DEFAULT NULL,
  `file_download5` varchar(255) DEFAULT NULL,
  `link_download5` varchar(255) DEFAULT NULL,
  `file_name6` varchar(255) DEFAULT NULL,
  `file_download6` varchar(255) DEFAULT NULL,
  `link_download6` varchar(255) DEFAULT NULL,
  `link_driver` varchar(255) DEFAULT NULL,
  `file_catalogue` varchar(255) DEFAULT NULL,
  `link_catalogue` varchar(255) DEFAULT NULL,
  `file_driver_name` varchar(255) DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `comments_published` int(11) DEFAULT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `style_mail` int(11) DEFAULT NULL,
  `hit1` int(11) NOT NULL,
  `hit2` int(11) NOT NULL,
  `hit3` int(11) NOT NULL,
  `hit4` int(11) NOT NULL,
  `hit5` int(11) NOT NULL,
  `hit6` int(11) NOT NULL,
  `types_alias` varchar(255) DEFAULT NULL,
  `application_alias` varchar(255) DEFAULT NULL,
  `teamview` tinyint(4) NOT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `landing_page` varchar(255) DEFAULT NULL,
  `other_languages1` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_fields_groups`
--

CREATE TABLE `fs_products_fields_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ordering` int(11) NOT NULL,
  `published` tinyint(4) NOT NULL,
  `created_time` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_filters`
--

CREATE TABLE `fs_products_filters` (
  `id` int(11) NOT NULL,
  `filter_show` varchar(255) DEFAULT NULL,
  `tablename` varchar(50) DEFAULT NULL,
  `field_name` varchar(50) DEFAULT NULL,
  `field_show` varchar(50) DEFAULT NULL,
  `field_ordering` int(11) DEFAULT NULL,
  `field_ordering_item` int(11) DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `calculator` int(11) DEFAULT NULL,
  `calculator_show` varchar(50) DEFAULT NULL,
  `filter_value` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `is_common` tinyint(4) NOT NULL DEFAULT 0,
  `is_condition` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Dùng trong trương hợp 1 trường xuất hiện nếu 1 trường kia xuất hiên. Ví dụ như dòng sp chỉ xuất hiện khi có hãng sx xuất hiện',
  `seo_title` text DEFAULT NULL,
  `seo_meta_key` text DEFAULT NULL,
  `seo_meta_des` text DEFAULT NULL,
  `lang` varchar(255) DEFAULT 'vi'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_filters_values`
--

CREATE TABLE `fs_products_filters_values` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL COMMENT 'id lấy từ fs_products_filter',
  `total` int(11) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `url_ids` varchar(255) DEFAULT NULL,
  `url_alias` varchar(255) DEFAULT NULL,
  `url_total_params` int(11) NOT NULL DEFAULT 0,
  `filter_show` varchar(255) DEFAULT NULL,
  `tablename` varchar(50) DEFAULT NULL,
  `field_name` varchar(50) DEFAULT NULL,
  `field_show` varchar(50) DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `calculator` int(11) DEFAULT NULL,
  `calculator_show` varchar(50) DEFAULT NULL,
  `filter_value` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `is_common` tinyint(4) NOT NULL DEFAULT 0,
  `is_condition` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'Dùng trong trương hợp 1 trường xuất hiện nếu 1 trường kia xuất hiên. Ví dụ như dòng sp chỉ xuất hiện khi có hãng sx xuất hiện'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_images`
--

CREATE TABLE `fs_products_images` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `temp` varchar(255) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_images_en`
--

CREATE TABLE `fs_products_images_en` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `temp` varchar(255) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_incentives`
--

CREATE TABLE `fs_products_incentives` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_incenty_id` int(11) NOT NULL,
  `product_incenty_name` varchar(255) NOT NULL,
  `price_old` double DEFAULT NULL,
  `price_new` double DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_price`
--

CREATE TABLE `fs_products_price` (
  `id` int(11) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `color_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sl_hn` int(11) DEFAULT NULL,
  `sl_hcm` int(11) DEFAULT NULL,
  `sl_dn` int(11) DEFAULT NULL,
  `is_default` tinyint(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_sizes`
--

CREATE TABLE `fs_products_sizes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `tablenames` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_tables`
--

CREATE TABLE `fs_products_tables` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_name_display` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `field_type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_length` int(11) DEFAULT NULL,
  `foreign_id` int(11) DEFAULT NULL,
  `foreign_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `foreign_tablename` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_compare` tinyint(4) DEFAULT NULL,
  `is_main` tinyint(4) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `is_filter` int(11) NOT NULL DEFAULT 0,
  `is_config` int(11) NOT NULL DEFAULT 0,
  `created_table` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_tables_en`
--

CREATE TABLE `fs_products_tables_en` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_name_display` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `field_type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `field_length` int(11) DEFAULT NULL,
  `foreign_id` int(11) DEFAULT NULL,
  `foreign_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `foreign_tablename` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_compare` tinyint(4) DEFAULT NULL,
  `is_main` tinyint(4) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `is_filter` int(11) NOT NULL DEFAULT 0,
  `is_config` int(11) NOT NULL DEFAULT 0,
  `created_table` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_types`
--

CREATE TABLE `fs_products_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `tablenames` varchar(225) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_products_types_en`
--

CREATE TABLE `fs_products_types_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `tablenames` varchar(225) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_product_contact`
--

CREATE TABLE `fs_product_contact` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `type_id` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `edited_time` datetime NOT NULL,
  `created_time` datetime NOT NULL,
  `published` tinyint(4) NOT NULL,
  `parts_email` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `products_id` int(11) DEFAULT NULL,
  `products_alias` varchar(255) DEFAULT NULL,
  `products_name` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_services`
--

CREATE TABLE `fs_services` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `hits` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `show_map` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_services_en`
--

CREATE TABLE `fs_services_en` (
  `id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_alias` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `category_id_wrapper` varchar(255) DEFAULT NULL,
  `category_alias_wrapper` varchar(255) DEFAULT NULL,
  `category_published` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `source_website` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `editor` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `hits` int(11) DEFAULT 0,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `title_display` varchar(255) DEFAULT NULL,
  `display_title` tinyint(4) DEFAULT 1,
  `display_column` int(11) DEFAULT NULL,
  `tags_group` int(11) DEFAULT NULL,
  `rating_count` int(11) DEFAULT NULL,
  `rating_sum` int(11) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `show_map` tinyint(4) DEFAULT 0,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL,
  `tawk_to` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_slideshow`
--

CREATE TABLE `fs_slideshow` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_thumb` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_slideshow_categories`
--

CREATE TABLE `fs_slideshow_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `width` int(11) DEFAULT 0,
  `height` int(11) DEFAULT NULL,
  `width_small` int(11) DEFAULT NULL,
  `height_small` int(11) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_slideshow_categories_en`
--

CREATE TABLE `fs_slideshow_categories_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `published` tinyint(4) NOT NULL DEFAULT 1,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `width` int(11) DEFAULT 0,
  `height` int(11) DEFAULT NULL,
  `width_small` int(11) DEFAULT NULL,
  `height_small` int(11) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_slideshow_en`
--

CREATE TABLE `fs_slideshow_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_thumb` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edited_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_tables`
--

CREATE TABLE `fs_tables` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `field_alias` varchar(255) NOT NULL,
  `field_name_display` varchar(255) DEFAULT NULL,
  `field_type` varchar(255) NOT NULL,
  `field_length` int(11) DEFAULT NULL,
  `foreign_id` int(11) DEFAULT NULL,
  `foreign_name` varchar(255) DEFAULT NULL,
  `foreign_tablename` varchar(255) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `is_filter` tinyint(4) NOT NULL DEFAULT 0,
  `is_display_in_admin` tinyint(4) NOT NULL DEFAULT 1,
  `is_default` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'để là summary_auto',
  `field_trigger` varchar(255) DEFAULT NULL COMMENT 'các trường mà nó gọi thêm cùng thao tác ( vd: price sẽ gọi price_discount để check)',
  `created_table` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_translate_content`
--

CREATE TABLE `fs_translate_content` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `etemplate_id` int(11) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `template` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_types_email`
--

CREATE TABLE `fs_types_email` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_types_email_en`
--

CREATE TABLE `fs_types_email_en` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tablenames` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `first_toll` varchar(255) DEFAULT NULL,
  `show_in_homepage` tinyint(4) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_keyword` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `prefix_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_retail` tinyint(4) DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `is_common` tinyint(4) DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_users`
--

CREATE TABLE `fs_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `fname` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `lname` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `ordering` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `last_visit_time` datetime DEFAULT NULL,
  `nums_visit` int(11) DEFAULT NULL,
  `status_online` tinyint(4) DEFAULT NULL,
  `agencies` varchar(255) DEFAULT NULL COMMENT 'Mặc định nếu group_id=2',
  `products_categories` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `news_categories` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `summary` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_users_permission`
--

CREATE TABLE `fs_users_permission` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL COMMENT 'Lấy id của permission_task',
  `permission` int(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=FIXED;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_users_permission_field`
--

CREATE TABLE `fs_users_permission_field` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL COMMENT 'Lấy id của permission_task',
  `permission` int(4) DEFAULT NULL,
  `list_field` text DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `view` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_users_permission_fun`
--

CREATE TABLE `fs_users_permission_fun` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL COMMENT 'Lấy id của permission_task',
  `permission` int(4) DEFAULT NULL,
  `list_field` text DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `view` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_video`
--

CREATE TABLE `fs_video` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `published` tinyint(4) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `course_category_id` int(11) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `author_last` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_last_id` int(11) DEFAULT NULL,
  `actflg` varchar(1) DEFAULT 'A',
  `ctdusr` varchar(5) DEFAULT NULL,
  `ctdwks` varchar(15) DEFAULT NULL,
  `ctddtm` datetime DEFAULT NULL,
  `mdfusr` varchar(5) DEFAULT NULL,
  `mdfwks` varchar(15) DEFAULT NULL,
  `lstmdf` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `cdtpgm` varchar(20) DEFAULT NULL,
  `mdfpgm` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_wards`
--

CREATE TABLE `fs_wards` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(30) NOT NULL,
  `location` varchar(30) NOT NULL,
  `districts_id` varchar(5) NOT NULL,
  `published` tinyint(1) NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `alias` varchar(255) DEFAULT NULL,
  `districts_name` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `city_name` varchar(255) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `edit_time` datetime DEFAULT NULL,
  `districts_alias` varchar(255) DEFAULT NULL,
  `city_alias` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fs_year`
--

CREATE TABLE `fs_year` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `published` tinyint(4) DEFAULT 0,
  `created_time` datetime DEFAULT NULL,
  `edit_time` datetime DEFAULT NULL,
  `ordering` int(11) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `fs_address`
--
ALTER TABLE `fs_address`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_address_en`
--
ALTER TABLE `fs_address_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_application`
--
ALTER TABLE `fs_application`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_application_en`
--
ALTER TABLE `fs_application_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_areas`
--
ALTER TABLE `fs_areas`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_banners`
--
ALTER TABLE `fs_banners`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_banners` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_banners_categories`
--
ALTER TABLE `fs_banners_categories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_banners_categories_en`
--
ALTER TABLE `fs_banners_categories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_banners_en`
--
ALTER TABLE `fs_banners_en`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_banners_en` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_banners_en_`
--
ALTER TABLE `fs_banners_en_`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_banners_en_` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_blocks`
--
ALTER TABLE `fs_blocks`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_blocks_en`
--
ALTER TABLE `fs_blocks_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_blocks_exist`
--
ALTER TABLE `fs_blocks_exist`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_business`
--
ALTER TABLE `fs_business`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_business_en`
--
ALTER TABLE `fs_business_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_cities`
--
ALTER TABLE `fs_cities`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_cities_en`
--
ALTER TABLE `fs_cities_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_config`
--
ALTER TABLE `fs_config`
  ADD PRIMARY KEY (`id`,`name`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_config_en`
--
ALTER TABLE `fs_config_en`
  ADD PRIMARY KEY (`id`,`name`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_config_enjicad`
--
ALTER TABLE `fs_config_enjicad`
  ADD PRIMARY KEY (`id`,`name`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_config_modules`
--
ALTER TABLE `fs_config_modules`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_config_modules_en`
--
ALTER TABLE `fs_config_modules_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contact`
--
ALTER TABLE `fs_contact`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contact_en`
--
ALTER TABLE `fs_contact_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contact_enjicad`
--
ALTER TABLE `fs_contact_enjicad`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contents`
--
ALTER TABLE `fs_contents`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contents_categories`
--
ALTER TABLE `fs_contents_categories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contents_categories_en`
--
ALTER TABLE `fs_contents_categories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contents_en`
--
ALTER TABLE `fs_contents_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_contents_en-bk`
--
ALTER TABLE `fs_contents_en-bk`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_email`
--
ALTER TABLE `fs_email`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_email_en`
--
ALTER TABLE `fs_email_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_event`
--
ALTER TABLE `fs_event`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_event_en`
--
ALTER TABLE `fs_event_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_extends_groups`
--
ALTER TABLE `fs_extends_groups`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_extends_items`
--
ALTER TABLE `fs_extends_items`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_history`
--
ALTER TABLE `fs_history`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_hits`
--
ALTER TABLE `fs_hits`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_image`
--
ALTER TABLE `fs_image`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_image_en`
--
ALTER TABLE `fs_image_en`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image_en` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_image_en_`
--
ALTER TABLE `fs_image_en_`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image_en_` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_image_images`
--
ALTER TABLE `fs_image_images`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image_images` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_image_images_en`
--
ALTER TABLE `fs_image_images_en`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image_images_en` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_image_images_en_`
--
ALTER TABLE `fs_image_images_en_`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_image_images_en_` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_keywords`
--
ALTER TABLE `fs_keywords`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_khuvuc`
--
ALTER TABLE `fs_khuvuc`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_khuvuc_en`
--
ALTER TABLE `fs_khuvuc_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_languages`
--
ALTER TABLE `fs_languages`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_languages_contents`
--
ALTER TABLE `fs_languages_contents`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_languages_tables`
--
ALTER TABLE `fs_languages_tables`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_languages_text`
--
ALTER TABLE `fs_languages_text`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_languages_text_admin`
--
ALTER TABLE `fs_languages_text_admin`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_manufactories`
--
ALTER TABLE `fs_manufactories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_manufactories_en`
--
ALTER TABLE `fs_manufactories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_manufactories_en_bk`
--
ALTER TABLE `fs_manufactories_en_bk`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_members`
--
ALTER TABLE `fs_members`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_admin`
--
ALTER TABLE `fs_menus_admin`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_createlink`
--
ALTER TABLE `fs_menus_createlink`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_groups`
--
ALTER TABLE `fs_menus_groups`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_groups_en`
--
ALTER TABLE `fs_menus_groups_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_items`
--
ALTER TABLE `fs_menus_items`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_items_en`
--
ALTER TABLE `fs_menus_items_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_menus_items_en_bk`
--
ALTER TABLE `fs_menus_items_en_bk`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news`
--
ALTER TABLE `fs_news`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_18052020`
--
ALTER TABLE `fs_news_18052020`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_categories`
--
ALTER TABLE `fs_news_categories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_categories_copy1`
--
ALTER TABLE `fs_news_categories_copy1`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_categories_en`
--
ALTER TABLE `fs_news_categories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_en`
--
ALTER TABLE `fs_news_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_en1`
--
ALTER TABLE `fs_news_en1`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_news_keyword`
--
ALTER TABLE `fs_news_keyword`
  ADD PRIMARY KEY (`id`),
  ADD KEY `new_id` (`new_id`);

--
-- Chỉ mục cho bảng `fs_onlinesupport`
--
ALTER TABLE `fs_onlinesupport`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_order`
--
ALTER TABLE `fs_order`
  ADD PRIMARY KEY (`id`,`recipients_name`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_order_items`
--
ALTER TABLE `fs_order_items`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_permission_field`
--
ALTER TABLE `fs_permission_field`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_permission_fun`
--
ALTER TABLE `fs_permission_fun`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_permission_tasks`
--
ALTER TABLE `fs_permission_tasks`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products`
--
ALTER TABLE `fs_products`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_products` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_products_categories`
--
ALTER TABLE `fs_products_categories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_categories_en`
--
ALTER TABLE `fs_products_categories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_copy1`
--
ALTER TABLE `fs_products_copy1`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_products_copy1` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_products_en`
--
ALTER TABLE `fs_products_en`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_products_en` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_products_en_`
--
ALTER TABLE `fs_products_en_`
  ADD PRIMARY KEY (`id`) USING BTREE;
ALTER TABLE `fs_products_en_` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `fs_products_fields_groups`
--
ALTER TABLE `fs_products_fields_groups`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_filters`
--
ALTER TABLE `fs_products_filters`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_filters_values`
--
ALTER TABLE `fs_products_filters_values`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_images`
--
ALTER TABLE `fs_products_images`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_images_en`
--
ALTER TABLE `fs_products_images_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_incentives`
--
ALTER TABLE `fs_products_incentives`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_price`
--
ALTER TABLE `fs_products_price`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_sizes`
--
ALTER TABLE `fs_products_sizes`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_tables`
--
ALTER TABLE `fs_products_tables`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_tables_en`
--
ALTER TABLE `fs_products_tables_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_types`
--
ALTER TABLE `fs_products_types`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_products_types_en`
--
ALTER TABLE `fs_products_types_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_product_contact`
--
ALTER TABLE `fs_product_contact`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_services`
--
ALTER TABLE `fs_services`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_services_en`
--
ALTER TABLE `fs_services_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_slideshow`
--
ALTER TABLE `fs_slideshow`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_slideshow_categories`
--
ALTER TABLE `fs_slideshow_categories`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_slideshow_categories_en`
--
ALTER TABLE `fs_slideshow_categories_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_slideshow_en`
--
ALTER TABLE `fs_slideshow_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_tables`
--
ALTER TABLE `fs_tables`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_translate_content`
--
ALTER TABLE `fs_translate_content`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_types_email`
--
ALTER TABLE `fs_types_email`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_types_email_en`
--
ALTER TABLE `fs_types_email_en`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_users`
--
ALTER TABLE `fs_users`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_users_permission`
--
ALTER TABLE `fs_users_permission`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_users_permission_field`
--
ALTER TABLE `fs_users_permission_field`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_users_permission_fun`
--
ALTER TABLE `fs_users_permission_fun`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_video`
--
ALTER TABLE `fs_video`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_wards`
--
ALTER TABLE `fs_wards`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `districtid` (`districts_id`) USING BTREE;

--
-- Chỉ mục cho bảng `fs_year`
--
ALTER TABLE `fs_year`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `fs_address`
--
ALTER TABLE `fs_address`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_address_en`
--
ALTER TABLE `fs_address_en`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_application`
--
ALTER TABLE `fs_application`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_application_en`
--
ALTER TABLE `fs_application_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_areas`
--
ALTER TABLE `fs_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_banners`
--
ALTER TABLE `fs_banners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_banners_categories`
--
ALTER TABLE `fs_banners_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_banners_categories_en`
--
ALTER TABLE `fs_banners_categories_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_banners_en`
--
ALTER TABLE `fs_banners_en`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_banners_en_`
--
ALTER TABLE `fs_banners_en_`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_blocks`
--
ALTER TABLE `fs_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_blocks_en`
--
ALTER TABLE `fs_blocks_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_blocks_exist`
--
ALTER TABLE `fs_blocks_exist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_business`
--
ALTER TABLE `fs_business`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_business_en`
--
ALTER TABLE `fs_business_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_cities`
--
ALTER TABLE `fs_cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_cities_en`
--
ALTER TABLE `fs_cities_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_config`
--
ALTER TABLE `fs_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_config_en`
--
ALTER TABLE `fs_config_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_config_enjicad`
--
ALTER TABLE `fs_config_enjicad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_config_modules`
--
ALTER TABLE `fs_config_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_config_modules_en`
--
ALTER TABLE `fs_config_modules_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contact`
--
ALTER TABLE `fs_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contact_en`
--
ALTER TABLE `fs_contact_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contact_enjicad`
--
ALTER TABLE `fs_contact_enjicad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contents`
--
ALTER TABLE `fs_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contents_categories`
--
ALTER TABLE `fs_contents_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contents_categories_en`
--
ALTER TABLE `fs_contents_categories_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contents_en`
--
ALTER TABLE `fs_contents_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_contents_en-bk`
--
ALTER TABLE `fs_contents_en-bk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_email`
--
ALTER TABLE `fs_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_email_en`
--
ALTER TABLE `fs_email_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_event`
--
ALTER TABLE `fs_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_event_en`
--
ALTER TABLE `fs_event_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_extends_groups`
--
ALTER TABLE `fs_extends_groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_extends_items`
--
ALTER TABLE `fs_extends_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_history`
--
ALTER TABLE `fs_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_hits`
--
ALTER TABLE `fs_hits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image`
--
ALTER TABLE `fs_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image_en`
--
ALTER TABLE `fs_image_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image_en_`
--
ALTER TABLE `fs_image_en_`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image_images`
--
ALTER TABLE `fs_image_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image_images_en`
--
ALTER TABLE `fs_image_images_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_image_images_en_`
--
ALTER TABLE `fs_image_images_en_`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_keywords`
--
ALTER TABLE `fs_keywords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_khuvuc`
--
ALTER TABLE `fs_khuvuc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_khuvuc_en`
--
ALTER TABLE `fs_khuvuc_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_languages`
--
ALTER TABLE `fs_languages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_languages_contents`
--
ALTER TABLE `fs_languages_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_languages_tables`
--
ALTER TABLE `fs_languages_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_languages_text`
--
ALTER TABLE `fs_languages_text`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_languages_text_admin`
--
ALTER TABLE `fs_languages_text_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_manufactories`
--
ALTER TABLE `fs_manufactories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_manufactories_en`
--
ALTER TABLE `fs_manufactories_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_manufactories_en_bk`
--
ALTER TABLE `fs_manufactories_en_bk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_members`
--
ALTER TABLE `fs_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_admin`
--
ALTER TABLE `fs_menus_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_createlink`
--
ALTER TABLE `fs_menus_createlink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_groups`
--
ALTER TABLE `fs_menus_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_groups_en`
--
ALTER TABLE `fs_menus_groups_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_items`
--
ALTER TABLE `fs_menus_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_items_en`
--
ALTER TABLE `fs_menus_items_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_menus_items_en_bk`
--
ALTER TABLE `fs_menus_items_en_bk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news`
--
ALTER TABLE `fs_news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_18052020`
--
ALTER TABLE `fs_news_18052020`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_categories`
--
ALTER TABLE `fs_news_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_categories_copy1`
--
ALTER TABLE `fs_news_categories_copy1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_categories_en`
--
ALTER TABLE `fs_news_categories_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_en`
--
ALTER TABLE `fs_news_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_en1`
--
ALTER TABLE `fs_news_en1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_news_keyword`
--
ALTER TABLE `fs_news_keyword`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_onlinesupport`
--
ALTER TABLE `fs_onlinesupport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_order`
--
ALTER TABLE `fs_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_order_items`
--
ALTER TABLE `fs_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_permission_field`
--
ALTER TABLE `fs_permission_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_permission_fun`
--
ALTER TABLE `fs_permission_fun`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_permission_tasks`
--
ALTER TABLE `fs_permission_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products`
--
ALTER TABLE `fs_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_categories`
--
ALTER TABLE `fs_products_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_categories_en`
--
ALTER TABLE `fs_products_categories_en`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_copy1`
--
ALTER TABLE `fs_products_copy1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_en`
--
ALTER TABLE `fs_products_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_en_`
--
ALTER TABLE `fs_products_en_`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_fields_groups`
--
ALTER TABLE `fs_products_fields_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_filters`
--
ALTER TABLE `fs_products_filters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_filters_values`
--
ALTER TABLE `fs_products_filters_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_images`
--
ALTER TABLE `fs_products_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_images_en`
--
ALTER TABLE `fs_products_images_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_incentives`
--
ALTER TABLE `fs_products_incentives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_price`
--
ALTER TABLE `fs_products_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_sizes`
--
ALTER TABLE `fs_products_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_tables`
--
ALTER TABLE `fs_products_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_tables_en`
--
ALTER TABLE `fs_products_tables_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_types`
--
ALTER TABLE `fs_products_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_products_types_en`
--
ALTER TABLE `fs_products_types_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_product_contact`
--
ALTER TABLE `fs_product_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_services`
--
ALTER TABLE `fs_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_services_en`
--
ALTER TABLE `fs_services_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_slideshow`
--
ALTER TABLE `fs_slideshow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_slideshow_categories`
--
ALTER TABLE `fs_slideshow_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_slideshow_categories_en`
--
ALTER TABLE `fs_slideshow_categories_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_slideshow_en`
--
ALTER TABLE `fs_slideshow_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_tables`
--
ALTER TABLE `fs_tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_translate_content`
--
ALTER TABLE `fs_translate_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_types_email`
--
ALTER TABLE `fs_types_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_types_email_en`
--
ALTER TABLE `fs_types_email_en`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_users`
--
ALTER TABLE `fs_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_users_permission`
--
ALTER TABLE `fs_users_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_users_permission_field`
--
ALTER TABLE `fs_users_permission_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_users_permission_fun`
--
ALTER TABLE `fs_users_permission_fun`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_video`
--
ALTER TABLE `fs_video`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_wards`
--
ALTER TABLE `fs_wards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `fs_year`
--
ALTER TABLE `fs_year`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
