create schema todoApp default character set utf8;

use todoApp;

create table task (
	id int not null auto_increment,
    task_name char(40) not null,
    imageurl char(255),
    PRIMARY KEY (id)
);

create table sub_task (
	id int not null auto_increment,
    description char(255) not null,
    date date not null,
    status int default 0,
    task_id int not null,
    Primary KEY (id),
    foreign key (task_id) references task(id)  
);

ALTER TABLE task
ADD COLUMN createdDate date after imageurl;
ALTER TABLE task
ADD COLUMN modifiedDate date after imageurl;
ALTER TABLE task
ADD COLUMN createdBy char(40) after imageurl;
ALTER TABLE task
ADD COLUMN modifiedBy char(40) after imageurl;

ALTER TABLE task
ADD COLUMN status int default 0 after imageurl;



start transaction;
	insert into task (task_name, imageurl) values ('test3','http://image.com/asd');
    SET @insertId = LAST_INSERT_ID();
    insert into sub_task (description, date, task_id) values('new description1','2020-12-11',@insertId);
    insert into sub_task (description, date, task_id) values('new description2','2020-12-11',@insertId);
    
commit;


SELECT 
	task.id,
    task_name,
    imageurl,
	description,
    date,
    task.status as task_status, 
    sub_task.status as sub_task_status,
    task_id,
    createdDate
FROM task JOIN sub_task ON task.id = sub_task.task_id 
ORDER BY task.id DESC;

select * from task;
select * from sub_task;

drop table task;

drop table sub_task;