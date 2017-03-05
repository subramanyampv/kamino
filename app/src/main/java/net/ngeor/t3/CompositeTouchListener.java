package net.ngeor.t3;

import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Implements a composite touch listener. It allows to use a collection of touch listeners in places where you can only
 * set one listener. The composite touch listener delegates the touch event to its listeners.
 */
public class CompositeTouchListener implements View.OnTouchListener {
    private Collection<View.OnTouchListener> listeners = Collections.emptyList();

    /**
     * Adds a new touch listener.
     * @param listener The touch listener to add.
     */
    public void addListener(View.OnTouchListener listener) {
        List<View.OnTouchListener> newListeners = new ArrayList<>();
        newListeners.addAll(listeners);
        newListeners.add(listener);
        listeners = Collections.unmodifiableCollection(newListeners);
    }

    /**
     * Removes a touch listener.
     * @param listener The touch listener to remove.
     */
    public void removeListener(View.OnTouchListener listener) {
        List<View.OnTouchListener> newListeners = new ArrayList<>();
        newListeners.addAll(listeners);
        newListeners.remove(listener);
        listeners = Collections.unmodifiableCollection(newListeners);
    }

    /**
     * Handles the touch event. The event is delegated to the listeners of this object.
     * If a listener returns true, the remaining listeners are not called.
     * @param view The view that was touched.
     * @param motionEvent The motion event.
     * @return true if the event was handled; false otherwise.
     */
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
