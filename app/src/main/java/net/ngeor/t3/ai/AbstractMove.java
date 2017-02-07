package net.ngeor.t3.ai;

import android.os.AsyncTask;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Location;

public abstract class AbstractMove extends AsyncTask<Void, Void, Location> {
    private final GameModel model;

    public AbstractMove(GameModel model) {
        this.model = model;
    }

    @Override
    protected Location doInBackground(Void... params) {
        // pause just for effect
        try {
            Thread.sleep(500);
        } catch (InterruptedException ex) {
        }


        return pickMove(model);
    }

    @Override
    protected void onPostExecute(Location location) {
        super.onPostExecute(location);
        if (location == null) {
            // TODO: fail
            return;
        }

        int row = location.getRow();
        int col = location.getCol();
        model.play(row, col);
    }

    protected abstract Location pickMove(GameModel model);
}
