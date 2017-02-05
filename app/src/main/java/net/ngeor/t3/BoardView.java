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
    private final static int LETTER_THICKNESS = 8;
    private final Paint backgroundPaint;
    private final Paint xPaint;
    private final Paint oPaint;
    private final Paint linesPaint;
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
        xPaint.setStrokeWidth(LETTER_THICKNESS);
        xPaint.setColor(Color.BLUE);

        oPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        oPaint.setStyle(Paint.Style.STROKE);
        oPaint.setStrokeWidth(LETTER_THICKNESS);
        oPaint.setColor(Color.RED);

        linesPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        linesPaint.setStyle(Paint.Style.STROKE);
        linesPaint.setStrokeWidth(1);
        linesPaint.setColor(Color.BLACK);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        // clear entire board
        canvas.drawRect(0, 0, getWidth(), getHeight(), backgroundPaint);

        if (model == null) {
            return;
        }

        final float rowHeight = getHeight() / model.getRows();
        final float colWidth = getWidth() / model.getCols();

        // vertical lines
        for (int col = 1; col < model.getCols(); col++) {
            canvas.drawLine(col * colWidth, 0, col * colWidth, getHeight(), linesPaint);
        }

        // horizontal lines
        for (int row = 1; row < model.getRows(); row++) {
            canvas.drawLine(0, row * rowHeight, getWidth(), row * rowHeight, linesPaint);
        }

        final float radius = Math.min(colWidth, rowHeight) / 2 - LETTER_THICKNESS;

        for (int row = 0; row < model.getRows(); row++) {
            final float top = row * rowHeight;
            final float bottom = top + rowHeight;

            for (int col = 0; col < model.getCols(); col++) {
                final TileState state = model.getState(row, col);
                final float left = col * colWidth;
                final float right = left + colWidth;
                final float cx = (left + right) / 2;
                final float cy = (top + bottom) / 2;

                if (state == TileState.X) {
                    final float startX = cx - radius;
                    final float startY = cy - radius;
                    final float stopX = cx + radius;
                    final float stopY = cy + radius;
                    canvas.drawLine(startX, startY, stopX, stopY, xPaint);
                    canvas.drawLine(startX, stopY, stopX, startY, xPaint);
                } else if (state == TileState.O) {
                    canvas.drawCircle(cx, cy, radius, oPaint);
                }
            }
        }
    }
}
