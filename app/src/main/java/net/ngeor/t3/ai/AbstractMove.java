package net.ngeor.t3.ai;

import android.content.Context;
import android.os.AsyncTask;
import android.widget.Toast;
import net.ngeor.t3.models.GameDto;
import net.ngeor.t3.models.Location;

public abstract class AbstractMove extends AsyncTask<Void, Void, Location> {
    private final Context context;
    private final GameDto model;

    public AbstractMove(Context context, GameDto model) {
        this.context = context;
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
            Toast.makeText(context, "Could not find move", Toast.LENGTH_SHORT).show();
            return;
        }

        int row = location.getRow();
        int col = location.getCol();
        model.play(row, col);
    }

    @Override
    protected void onCancelled() {
        super.onCancelled();
        Toast.makeText(context, "AI cancelled", Toast.LENGTH_SHORT).show();
    }

    /**
     * Due to the inability to mock the isCancelled method,
     * we use this workaround.
     */
    boolean testMode = false;

    protected boolean internalIsCancelled() {
        return testMode ? false : isCancelled();
    }

    protected abstract Location pickMove(GameDto model);
}
