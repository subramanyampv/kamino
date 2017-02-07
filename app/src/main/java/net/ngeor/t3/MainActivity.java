package net.ngeor.t3;

import android.content.Intent;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.view.MotionEvent;
import android.view.View;
import android.widget.TextView;
import net.ngeor.t3.ai.AIPlayer;
import net.ngeor.t3.models.GameDto;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.TileState;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    // model
    private GameModel model;

    // AI player listens to model change events to know when its turn to play
    private final AIPlayer aiPlayer = new AIPlayer();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // set AILevel from settings
        SettingsAdapter settingsAdapter = new SettingsAdapter(this);
        aiPlayer.setAILevel(settingsAdapter.getAILevel());

        // restore model
        if (savedInstanceState != null) {
            StateManager stateManager = new StateManager(savedInstanceState);
            GameDto savedGameState = stateManager.getGame();
            model = new GameModel(savedGameState);
        } else {
            model = createGameModel();
        }

        setModel(model);

        // create and touch listener
        getBoardView().setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (model.getState() != GameState.WaitingPlayer || !model.isHumanTurn()) {
                    return false;
                }

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    int col = (int) (model.getBoardModel().getCols() * event.getX() / v.getWidth());
                    int row = (int) (model.getBoardModel().getRows() * event.getY() / v.getHeight());
                    TileState tileState = model.getBoardModel().getTileState(row, col);
                    if (tileState == TileState.EMPTY) {
                        model.play(row, col);
                    }
                }

                return true;
            }
        });

        findViewById(R.id.btn_restart).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final GameModel newModel = createGameModel();
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
        if (aiPlayer.getAILevel() != settings.getAILevel()) {
            // settings changed
            // TODO: do not change AI level mid-game
            aiPlayer.setAILevel(settings.getAILevel());
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        StateManager stateManager = new StateManager(outState);
        stateManager.setGame(new GameDto(model));
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
        getBoardView().setModel(model.getBoardModel());
        GameListener gameListener = new GameListener(this);
        model.addGameModelListener(gameListener);
        model.addGameModelListener(aiPlayer);

        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText(model);
        }
    }

    private GameModel createGameModel() {
        return new GameModel(3, 3);
    }
}
