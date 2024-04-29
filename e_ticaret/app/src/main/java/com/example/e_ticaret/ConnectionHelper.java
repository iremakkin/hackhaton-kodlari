package com.example.e_ticaret;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionHelper {

    private  String uname, pass, ip, port, db;

    public Connection connectionclass() {
        ip = "172.17.0.1";
        db = "Market";
        uname = "postgres";
        pass = "postgres123;";
        port = "5432";
        Connection connection = null;
        String ConnectionURL = null;
        try {
            Class.forName("org.postgresql.Driver");
            ConnectionURL = "jdbc:postgresql://" + ip + ":" + port + "/" + db;
            connection = DriverManager.getConnection(ConnectionURL, uname, pass);
        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return connection;
    }
    
}
