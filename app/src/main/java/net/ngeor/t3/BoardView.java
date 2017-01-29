package net.ngeor.t3;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.widget.ImageView;

/**
 * Draws the board.
 * Created by ngeor on 1/29/2017.
 */
public class BoardView extends ImageView {
    private Paint backgroundPaint;
    private Paint xPaint;
    private Paint oPaint;
    private Paint linesPaint;
    private GameModel model;

    public GameModel getModel() {
        return model;
    }

    public void setModel(GameModel model) {
        this.model = model;
    }

    public BoardView(Context context, AttributeSet attrs) {
        super(context, attrs);

        backgroundPaint = new Paint();
        backgroundPaint.setColor(Color.WHITE);
        backgroundPaint.setStyle(Paint.Style.FILL);

        xPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        xPaint.setStyle(Paint.Style.STROKE);
        xPaint.setStrokeWidth(4);
        xPaint.setColor(Color.BLUE);

        oPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        oPaint.setStyle(Paint.Style.STROKE);
        oPaint.setStrokeWidth(4);
        oPaint.setColor(Color.RED);

        linesPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        linesPaint.setStyle(Paint.Style.STROKE);
        linesPaint.setStrokeWidth(1);
        linesPaint.setColor(Color.BLACK);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);

        // left vertical line
        canvas.drawLine(getWidth() / 3, 0, getWidth() / 3, getHeight(), linesPaint);

        // right vertical line
        canvas.drawLine(2 * getWidth() / 3, 0, 2 * getWidth() / 3, getHeight(), linesPaint);

        // top horizontal line
        canvas.drawLine(0, getHeight() / 3, getWidth(), getHeight() / 3, linesPaint);

        // bottom horizontal line
        canvas.drawLine(0, 2 * getHeight() / 3, getWidth(), 2 * getHeight() / 3, linesPaint);

        if (model == null) {
            return;
        }

        final float rowHeight = getHeight() / GameModel.ROWS;
        final float colWidth = getWidth() / GameModel.COLS;
        final float radius = Math.min(colWidth, rowHeight) / 2;

        for (int row = 0; row < GameModel.ROWS; row++) {
            final float top = row * rowHeight;
            final float bottom = top + rowHeight;

            for (int col = 0; col < GameModel.COLS; col++) {
                final TileState state = model.getState(row, col);
                final float left = col * colWidth;
                final float right = left + colWidth;

                if (state == TileState.X) {
                    canvas.drawLine(left, top, right, bottom, xPaint);
                    canvas.drawLine(left, bottom, right, top, xPaint);
                } else if (state == TileState.O) {
                    canvas.drawCircle((left + right) / 2, (top + bottom) / 2, radius, oPaint);
                }
            }
        }
    }
}
