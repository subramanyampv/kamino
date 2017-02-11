package net.ngeor.t3;

import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class CompositeTouchListener implements View.OnTouchListener {
    private Collection<View.OnTouchListener> listeners = Collections.emptyList();

    public void addListener(View.OnTouchListener listener) {
        List<View.OnTouchListener> newListeners = new ArrayList<>();
        newListeners.addAll(listeners);
        newListeners.add(listener);
        listeners = Collections.unmodifiableCollection(newListeners);
    }

    public void removeListener(View.OnTouchListener listener) {
        List<View.OnTouchListener> newListeners = new ArrayList<>();
        newListeners.addAll(listeners);
        newListeners.remove(listener);
        listeners = Collections.unmodifiableCollection(newListeners);
    }

    @Override
    public boolean onTouch(View view, MotionEvent motionEvent) {
        Collection<View.OnTouchListener> temp = listeners;
        for (View.OnTouchListener listener : temp) {
            if (listener.onTouch(view, motionEvent)) {
                return true;
            }
        }

        return false;
    }
}
