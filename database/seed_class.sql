-- this is only temporary, used for testing functionalities only

use english_center;

insert into class values(date_sub(curdate(),interval 1 month),date_add(curdate(),interval 2 month),'TOEIC01',2,30,24),
(date_sub(curdate(),interval 1 month),date_add(curdate(),interval 2 month),'TOEIC02',1,40,36);