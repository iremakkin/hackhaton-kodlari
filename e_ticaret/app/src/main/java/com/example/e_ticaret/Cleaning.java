package com.example.e_ticaret;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class Cleaning extends AppCompatActivity {

    TextView exitt ;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_cleaning);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        exitt = findViewById(R.id.exitt);
        exitt.setVisibility(View.INVISIBLE);
    }
    public void panelopen(View view){
        exitt.setVisibility(View.VISIBLE);
    }

    public  void  gotologin(View view){
        Intent intent = new Intent(Cleaning.this , LogIn.class);
        startActivity(intent);
    }
    public void sepeteekle(View view){
        AlertDialog.Builder alert;
        alert = new AlertDialog.Builder(this);
        alert.setTitle("Başarılı");
        alert.setMessage("Ürün sepetinize başarıyla eklendi");
        alert.show();
    }
}