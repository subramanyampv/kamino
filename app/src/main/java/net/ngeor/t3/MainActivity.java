package net.ngeor.t3;

import android.content.Intent;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;
import net.ngeor.t3.ai.AIPlayer;
import net.ngeor.t3.models.*;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    // bundle key for storing the model
    private static final String BUNDLE_KEY_MODEL = "model";

    // model
    private GameModel model;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // restore model
        if (savedInstanceState != null) {
            GameDto savedGameState = (GameDto)savedInstanceState.getSerializable(BUNDLE_KEY_MODEL);
            model = new GameModel(savedGameState);
        } else {
            model = new GameModel(createGameParameters());
        }

        setModel(model);

        // create and touch listener
        getBoardView().setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                final BoardView boardView = (BoardView)v;
                final GameModel model = boardView.getModel();
                if (model.getState() != GameState.WaitingPlayer || !model.isHumanTurn()) {
                    return false;
                }

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    int col = (int) (model.getCols() * event.getX() / v.getWidth());
                    int row = (int) (model.getRows() * event.getY() / v.getHeight());
                    if (model.getState(row, col) == TileState.Empty) {
                        model.play(row, col);
                    }
                }

                return true;
            }
        });

        findViewById(R.id.btn_restart).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final GameModel newModel = new GameModel(model.getGameParameters());
                setModel(newModel);
            }
        });

        findViewById(R.id.btn_settings).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        SettingsAdapter settings = new SettingsAdapter(this);
        if (model.getGameParameters().getAILevel() != settings.getAILevel()) {
            // settings changed
            final GameModel newModel = new GameModel(createGameParameters());
            setModel(newModel);
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putSerializable(BUNDLE_KEY_MODEL, new GameDto(model));
    }

    @Override
    public void setHeaderText(int resourceId) {
        getHeaderView().setText(resourceId);
    }

    @Override
    public void invalidateBoardView() {
        getBoardView().invalidate();
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    private void setModel(GameModel model) {
        this.model = model;
        getBoardView().setModel(model);
        GameListener gameListener = new GameListener(this);
        model.addGameModelListener(gameListener);
        AIPlayer ai = new AIPlayer();
        model.addGameModelListener(ai);

        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText(model);
        }
    }

    private GameParameters createGameParameters() {
        SettingsAdapter settings = new SettingsAdapter(this);
        return new GameParameters(3, 3, Player.X, Player.X, settings.getAILevel());
    }
}
