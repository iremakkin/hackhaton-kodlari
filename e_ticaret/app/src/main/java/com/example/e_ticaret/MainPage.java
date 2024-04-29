package com.example.e_ticaret;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainPage extends AppCompatActivity {

    TextView exitb;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main_page);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.gmail), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        exitb = findViewById(R.id.exitb);
        exitb.setVisibility(View.INVISIBLE);
    }
    public void sepetigoster (View view){
        Intent intent = new Intent(MainPage.this , sepet.class);
        startActivity(intent);
    }
    public void yiyecekler (View view){
        Intent intent = new Intent(MainPage.this , Yiyecekler.class);
        startActivity(intent);
    }
    public void icecekgit (View view){
        Intent intent = new Intent(MainPage.this , Icecekler.class);
        startActivity(intent);
    }
    public void kisiselurunler (View view){
        Intent intent = new Intent(MainPage.this , KisiselUrunler.class);
        startActivity(intent);
    }
    public void cleaning (View view){
        Intent intent = new Intent(MainPage.this , Cleaning.class);
        startActivity(intent);
    }
    public void exit (View view){
        Intent intent = new Intent(MainPage.this , LogIn.class);
        startActivity(intent);

    }
    public void openpanel(View view){
        exitb.setVisibility(View.VISIBLE);
    }


}