package net.ngeor.t3;

import android.view.MotionEvent;
import android.view.View;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

/**
 * Created by ngeor on 3/5/2017.
 */
public class CompositeTouchListenerTest {
    private View view;
    private MotionEvent motionEvent;
    private CompositeTouchListener compositeTouchListener;

    /**
     * A touch listener that handles the event.
     */
    private View.OnTouchListener handlingTouchListener;

    /**
     * A touch listener that ignores the event.
     */
    private View.OnTouchListener nonHandlingTouchListener;

    @Before
    public void setUp() {
        view = mock(View.class);
        motionEvent = mock(MotionEvent.class);
        compositeTouchListener = new CompositeTouchListener();
        handlingTouchListener = mock(View.OnTouchListener.class);
        when(handlingTouchListener.onTouch(view, motionEvent)).thenReturn(true);
        nonHandlingTouchListener = mock(View.OnTouchListener.class);
        when(nonHandlingTouchListener.onTouch(view, motionEvent)).thenReturn(false);
    }

    @Test
    public void onTouchWithoutListeners() {
        boolean handled = compositeTouchListener.onTouch(view, motionEvent);
        assertFalse(handled);
    }

    @Test
    public void addListener() throws Exception {
        // arrange
        compositeTouchListener.addListener(handlingTouchListener);

        // act
        boolean handled = compositeTouchListener.onTouch(view, motionEvent);

        // assert
        assertTrue(handled);
        verify(handlingTouchListener).onTouch(view, motionEvent);
    }

    @Test
    public void removeListener() throws Exception {
        // arrange
        compositeTouchListener.addListener(handlingTouchListener);

        // act
        compositeTouchListener.removeListener(handlingTouchListener);

        // assert
        boolean handled = compositeTouchListener.onTouch(view, motionEvent);
        assertFalse(handled);
    }

    @Test
    public void handlingListenerSkipsNonHandlingListener() throws Exception {
        // arrange
        compositeTouchListener.addListener(handlingTouchListener);
        compositeTouchListener.addListener(nonHandlingTouchListener);

        // act
        boolean handled = compositeTouchListener.onTouch(view, motionEvent);

        // assert
        assertTrue(handled);
        verify(handlingTouchListener).onTouch(view, motionEvent);
        verify(nonHandlingTouchListener, never()).onTouch(view, motionEvent);
    }

    @Test
    public void nonHandlingListenerDoesNotSkipHandlingListener() throws Exception {
        // arrange
        compositeTouchListener.addListener(nonHandlingTouchListener);
        compositeTouchListener.addListener(handlingTouchListener);

        // act
        boolean handled = compositeTouchListener.onTouch(view, motionEvent);

        // assert
        assertTrue(handled);
        verify(handlingTouchListener).onTouch(view, motionEvent);
        verify(nonHandlingTouchListener).onTouch(view, motionEvent);
    }
}