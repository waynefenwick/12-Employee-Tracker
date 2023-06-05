-- example of seeds to the schema --
INSERT INTO departments (name)
VALUES    ('Billing'),
          ('Support'),
          ('Web Design'),
          ('EMS Programming'),
          ('Project Management'),
          ('Senior Management'),
          ('Sales');

INSERT INTO roles (title, departments_id, salary)
VALUES    ('Finance Manager', 1, 60000),
          ('Support Staff', 2, 50000),
          ('Web Designer', 3, 55000),
          ('EMS Programmer', 4, 75000),
          ('Project Manager', 5, 50000),
          ('Department Manager', 6, 85000),
          ('Sales Professional', 7, 65000);

INSERT INTO employees (first_name, last_name, departments_id, roles_id, manager_id, salary)
VALUES    ('Jessi', 'Story', 1, 1, 9, 60000),
          ('James', 'Cobake', 7, 7, 9, 65000),
          ('Lorna', 'Bachwood', 5, 5, 9, 50000),
          ('David', 'Wickfen', 5, 5, 2, 50000),
          ('Rod', 'Stornack', 4, 4, 2, 75000),
          ('Pat', 'Goyle', 6, 6, NULL, 85000),
          ('Drake', 'McSpring', 3, 3, 6, 55000),
          ('John', 'Jackson', 7, 7, 6, 65000),
          ('Lynn', 'Lonestark', 6, 6, 9, 85000),
          ('Mit', 'Backhorn', 3, 3, 2, 55000),
          ('Dot', 'Geschin', 6, 6, 6, 85000),
          ('Josy', 'Carryway', 2, 2, 9, 50000),
          ('Steven', 'Hardwork', 4, 4, 2, 75000),
          ('Mat', 'Zachin', 4, 4, 6, 75000);

