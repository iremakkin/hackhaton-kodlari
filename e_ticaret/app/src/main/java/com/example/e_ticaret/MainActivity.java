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

public class MainActivity extends AppCompatActivity {

    EditText gmailtxt ;
    EditText names;
    EditText pass;
    EditText pass2;
    AlertDialog.Builder alert;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.gmail), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        gmailtxt = findViewById(R.id.gmailtxt);
        names = findViewById(R.id.names);
        pass = findViewById(R.id.pass);
        pass2  =findViewById(R.id.pass2);
    }

    public void login (View view){
        if(gmailtxt.getText().toString().matches("") || names.getText().toString().matches("")){
            alert = new AlertDialog.Builder(this);
            alert.setTitle("Kayıt Başarısız");
            alert.setMessage("adınız ve mailiniz boş olamaz");
            alert.show();

        }
        else if(!(pass.getText().toString().length()>8)){
            alert = new AlertDialog.Builder(this);
            alert.setTitle("Şifre");
            alert.setMessage("Şifreniz 8 karakterden uzun olmalı");
            alert.show();
        }
        else if (!pass.getText().toString().matches(pass2.getText().toString())) {
            alert = new AlertDialog.Builder(this);
            alert.setTitle("Şifre");
            alert.setMessage("Şifreleriniz eşleşmiyor");
            alert.show();
        } else{
            Intent intent = new Intent(MainActivity.this , LogIn.class);
            startActivity(intent);
        }
    }
    public void girisyap (View view){
        Intent intent = new Intent(MainActivity.this , LogIn.class);
        startActivity(intent);
    }
}