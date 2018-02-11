package net.ngeor.t3.ai;

import android.os.AsyncTask;

import net.ngeor.t3.MessageBox;
import net.ngeor.t3.R;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.MutableGameModel;

public class MovesPickerAsyncTask extends AsyncTask<Void, Void, Location> {
    private final MessageBox messageBox;
    private final MutableGameModel model;
    private final MovePicker movePicker;

    public MovesPickerAsyncTask(MessageBox messageBox, MutableGameModel model, MovePicker movePicker) {
        this.messageBox = messageBox;
        this.model = model;
        this.movePicker = movePicker;
    }

    @Override
    protected Location doInBackground(Void... params) {
        // pause just for effect
        try {
            Thread.sleep(500);
        } catch (InterruptedException ex) {
        }

        return movePicker.pickMove(model);
    }

    @Override
    protected void onPostExecute(Location location) {
        super.onPostExecute(location);
        if (location == null) {
            messageBox.show(R.string.err_could_not_find_move);
            return;
        }

        int row = location.getRow();
        int col = location.getCol();
        model.play(row, col);
    }

    @Override
    protected void onCancelled() {
        super.onCancelled();
        messageBox.show(R.string.err_async_cancel);
    }
}
