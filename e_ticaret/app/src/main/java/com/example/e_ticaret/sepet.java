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

public class sepet extends AppCompatActivity {

    TextView sepettencik;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sepet);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.gmail), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        sepettencik = findViewById(R.id.sepettencik);
        sepettencik.setVisibility(View.INVISIBLE);
    }

    public  void panellacc(View view){
        sepettencik.setVisibility(View.VISIBLE);
    }

    public void setSepettencik(TextView sepettencik) {
        Intent intent = new Intent(sepet.this , LogIn.class);
        startActivity(intent);
    }

    public void buy(){
        //sepeti boşalt
    }

}