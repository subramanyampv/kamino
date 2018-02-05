package net.ngeor.t3.ai;

import android.os.AsyncTask;
import net.ngeor.t3.models.GameDto;
import net.ngeor.t3.models.Location;

public abstract class AbstractMove extends AsyncTask<Void, Void, Location> {
    private final MessageBox messageBox;
    private final GameDto model;

    public AbstractMove(MessageBox messageBox, GameDto model) {
        this.messageBox = messageBox;
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
            messageBox.show("Could not find move");
            return;
        }

        int row = location.getRow();
        int col = location.getCol();
        model.play(row, col);
    }

    @Override
    protected void onCancelled() {
        super.onCancelled();
        messageBox.show("AI cancelled");
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
