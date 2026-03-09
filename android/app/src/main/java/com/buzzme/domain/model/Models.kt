package com.buzzme.domain.model

import java.time.Instant

data class User(
    val id: String,
    val username: String,
    val email: String,
    val pairingCode: String
)

data class Partner(
    val id: String,
    val username: String,
    val isOnline: Boolean
)

data class Buzz(
    val id: String,
    val senderId: String,
    val receiverId: String,
    val pattern: BuzzPattern,
    val sentAt: Instant,
    val delivered: Boolean
)

enum class BuzzPattern(val displayName: String) {
    SHORT("Short Pulse"),
    LONG("Long Buzz"),
    HEARTBEAT("Heartbeat"),
    SOS("SOS"),
    DOUBLE("Double Tap")
}

sealed class ConnectionState {
    object Disconnected : ConnectionState()
    object Connecting : ConnectionState()
    object Connected : ConnectionState()
    data class Error(val message: String) : ConnectionState()
}
