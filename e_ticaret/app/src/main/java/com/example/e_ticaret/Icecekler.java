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

public class Icecekler extends AppCompatActivity {


    TextView cikis;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_icecekler);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;

        });


        cikis = findViewById(R.id.cikis);
        cikis.setVisibility(View.INVISIBLE);

    }
    public void panelac (View view){
        cikis.setVisibility(View.VISIBLE);
    }
    public void cikisyap(View view){
        Intent intent = new Intent(Icecekler.this , LogIn.class);
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