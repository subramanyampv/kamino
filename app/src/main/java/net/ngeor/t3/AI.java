package net.ngeor.t3;

import android.graphics.Point;
import android.os.AsyncTask;

public class AI extends AsyncTask<Void, Void, Point> {
    private final GameModel model;

    public AI(GameModel model) {
        this.model = model;
    }

    @Override
    protected Point doInBackground(Void... params) {
        // pause just for effect
        try {
            Thread.sleep(500);
        } catch (InterruptedException ex) {
        }

        for (int row = 0; row < model.getRows(); row++) {
            for (int col = 0; col < model.getCols(); col++) {
                if (model.getState(row, col) == TileState.Empty) {
                    return new Point(col, row);
                }
            }
        }

        return null;
    }

    @Override
    protected void onPostExecute(Point point) {
        super.onPostExecute(point);
        if (point == null) {
            // TODO: fail
            return;
        }

        int row = point.y;
        int col = point.x;
        model.play(row, col);
    }
}
