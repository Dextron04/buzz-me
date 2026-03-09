package com.buzzme.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import com.buzzme.R

/**
 * BuzzConnectionService
 *
 * A Foreground Service that maintains a persistent WebSocket connection
 * to the BuzzMe server. Runs as long as the user is logged in and paired.
 *
 * Responsibilities:
 *  - Open and hold a WebSocket connection via BuzzWebSocketClient
 *  - Deliver incoming BUZZ events to VibrationManager (no notification)
 *  - Handle reconnection with exponential backoff
 *  - Broadcast presence events (partner online/offline) to the UI layer
 *  - Acquire WAKE_LOCK on buzz receipt to ensure vibration fires on locked screen
 */
class BuzzConnectionService : Service() {

    companion object {
        const val CHANNEL_ID = "buzz_connection_channel"
        const val NOTIFICATION_ID = 1
        const val ACTION_START = "com.buzzme.action.START_CONNECTION"
        const val ACTION_STOP = "com.buzzme.action.STOP_CONNECTION"
    }

    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startForegroundService()
            ACTION_STOP -> stopSelf()
        }
        return START_STICKY
    }

    private fun startForegroundService() {
        val notification = buildNotification()
        startForeground(NOTIFICATION_ID, notification)
        acquireWakeLock()
        // TODO: Initialize BuzzWebSocketClient and connect
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("BuzzMe")
            .setContentText("Connected — ready to buzz")
            .setSmallIcon(R.drawable.ic_notification)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setSilent(true)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "BuzzMe Connection",
            NotificationManager.IMPORTANCE_MIN
        ).apply {
            description = "Keeps BuzzMe connected in the background"
            setShowBadge(false)
        }
        getSystemService(NotificationManager::class.java)
            .createNotificationChannel(channel)
    }

    private fun acquireWakeLock() {
        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "BuzzMe::ConnectionWakeLock"
        )
        wakeLock?.acquire(10 * 60 * 1000L) // 10 min max
    }

    override fun onDestroy() {
        wakeLock?.release()
        // TODO: Close WebSocket cleanly
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
