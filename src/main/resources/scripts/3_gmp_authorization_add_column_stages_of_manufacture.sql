ALTER TABLE `amed`.`gmp_authorization` 
CHANGE COLUMN `stages_of_manufacture` `stages_of_manufacture` VARCHAR(2000) NULL DEFAULT NULL AFTER `place_distribution_email`;
