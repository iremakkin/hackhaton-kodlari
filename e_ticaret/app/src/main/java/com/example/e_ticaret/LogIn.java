package com.example.e_ticaret;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.xml.transform.Result;

public class LogIn extends AppCompatActivity {

    AlertDialog.Builder alert;
    Connection connect;
    String ConnectionResult;
    EditText loginpassword;
    EditText logingmail;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_log_in);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.gmail), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    /*public void GetTextFromSQL(View v){
        loginpassword = (EditText) findViewById(R.id.loginpasssword);
        logingmail = (EditText) findViewById(R.id.logingmail);

        String email = logingmail.getText().toString();
        String password = loginpassword.getText().toString();



        try {
            ConnectionHelper ch = new ConnectionHelper();
            connect = ch.connectionclass();
            if(connect != null){
                String sorgu = "SELECT * FROM users WHERE userMail = '" + email + "' AND userPassword = '" + password + "'";
                Statement st = connect.createStatement();
                ResultSet rs = st.executeQuery(sorgu);
                System.out.println(rs.next());
                if (rs.next()) {
                    Intent intent = new Intent(LogIn.this , MainPage.class);
                    startActivity(intent);
                    // Kullanıcı bulundu, giriş başarılı
                    // Burada giriş başarılı olduğunu işaretlemek için bir işlem yapabilirsiniz, örneğin Intent ile ana sayfaya yönlendirme.
                } else {
                    alert = new AlertDialog.Builder(this);
                    alert.setTitle("Giriş Başarısız");
                    alert.setMessage("Giriş başarısız. Kullanıcı adı veya şifre yanlış.");
                    alert.show();
                    // Kullanıcı bulunamadı veya şifre yanlış
                    // Kullanıcıya giriş bilgilerinin yanlış olduğunu belirten bir mesaj gösterebilirsiniz.
                }
            }
        } catch(Exception e){
            e.printStackTrace();
        }

    }*/
    public void login(View view){
        Intent intent = new Intent(LogIn.this , MainPage.class);
        startActivity(intent);
    }
}
