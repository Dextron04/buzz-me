package com.buzzme.ui.screens.home

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

// TODO: Inject repositories; expose connection state + buzz actions as StateFlow
@HiltViewModel
class HomeViewModel @Inject constructor() : ViewModel()
