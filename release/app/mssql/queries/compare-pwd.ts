export const checkUserPwd = `select same = PWDCOMPARE(@pwd, password_hash) from sys.sql_logins where name = @username`;
