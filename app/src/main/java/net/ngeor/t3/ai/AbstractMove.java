package net.ngeor.t3.ai;

import android.os.AsyncTask;
import net.ngeor.t3.models.GameDto;
import net.ngeor.t3.models.Location;

public abstract class AbstractMove extends AsyncTask<Void, Void, Location> {
    private final GameDto model;

    public AbstractMove(GameDto model) {
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
            throw new IllegalStateException("No valid moves found!");
        }

        int row = location.getRow();
        int col = location.getCol();
        model.play(row, col);
    }

    protected abstract Location pickMove(GameDto model);
}
