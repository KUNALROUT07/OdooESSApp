package com.myodooempapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import java.util.concurrent.TimeUnit;

import javax.annotation.Nullable;

public class ForegroundHeadlessService extends Service {

    private static final String TAG = "ForegroundHeadlessService";
    private static final String CHANNEL_ID = "location_channel";
    private static final int NOTIFICATION_ID = 1001;

    private Handler handler = new Handler();

    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();

            // Start GeolocationHeadlessTask
            Intent headlessTaskIntent = new Intent(context, GeolocationHeadlessTask.class);
            context.startService(headlessTaskIntent);

            // Acquire wake lock
            HeadlessJsTaskService.acquireWakeLockNow(context);

            // Schedule next execution
            handler.postDelayed(this, 180000);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode); // Stop runnable execution
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "POC Location Gather Service",
                    NotificationManager.IMPORTANCE_MIN
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.getAction() != null && intent.getAction().equals("START_FOREGROUND")) {
            Log.d(TAG, "Starting foreground headless service");
            startForeground(NOTIFICATION_ID, createNotification());

            // Start headlessJS Task that is going to access location
//            Intent headlessIntent = new Intent(getApplicationContext(), GeolocationHeadlessTask.class);
//            getApplicationContext().startService(headlessIntent);
            this.handler.post(this.runnableCode);
        } else if (intent != null && intent.getAction() != null && intent.getAction().equals("STOP_FOREGROUND")) {
            Log.d(TAG, "Stopping foreground headless service");
            stopForeground(true);
            stopSelf();
        }
        return START_STICKY;
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Location Gather")
                .setContentText("Background location is active")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .build();
    }


    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}