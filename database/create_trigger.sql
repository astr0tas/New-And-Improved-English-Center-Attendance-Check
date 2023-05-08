USE ENGLISH_CENTER;

DELIMITER $$
CREATE TRIGGER addNewStudent
AFTER INSERT ON in_class FOR EACH ROW
BEGIN
	UPDATE class
	SET Current_number_of_student = Current_number_of_student + 1
	WHERE name = NEW.Class_name;
END $$
DELIMITER ;
