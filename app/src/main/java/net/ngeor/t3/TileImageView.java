package net.ngeor.t3;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.widget.ImageView;

/**
 * Created by ngeor on 1/29/2017.
 */
public class TileImageView extends ImageView {
    private Paint backgroundPaint;
    private Paint penPaint;
    private TileState state = TileState.Empty;

    public TileState getState() {
        return state;
    }

    public void setState(TileState state) {
        this.state = state;
    }

    public TileImageView(Context context, AttributeSet attrs) {
        super(context, attrs);

        backgroundPaint = new Paint();
        backgroundPaint.setColor(Color.WHITE);
        backgroundPaint.setStyle(Paint.Style.FILL);

        penPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        penPaint.setStyle(Paint.Style.STROKE);
        penPaint.setStrokeWidth(2);
        penPaint.setColor(Color.BLUE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);

        if (state == TileState.O) {
            float cx = getWidth() / 2;
            float cy = getHeight() / 2;
            float radius = Math.min(cx, cy);
            canvas.drawCircle(cx, cy, radius, penPaint);
        } else if (state == TileState.X) {
            canvas.drawLine(0, 0, getWidth(), getHeight(), penPaint);
            canvas.drawLine(0, getHeight(), getWidth(), 0, penPaint);
        }
    }
}
